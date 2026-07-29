import { describe, it, expect, vi, afterAll, beforeEach } from "vitest";

const { createProviderChargeMock } = vi.hoisted(() => ({
  createProviderChargeMock: vi.fn(),
}));

vi.mock("../lib/paymentProvider", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../lib/paymentProvider")>();
  return {
    ...actual,
    createProviderCharge: createProviderChargeMock,
  };
});

import { eq } from "drizzle-orm";
import {
  claimPaymobOrderForIntent,
  findIntentIdByPaymobOrderId,
  createTopupIntent,
} from "./PaymentIntentService";
import { db, createUser, deleteUsers, randomUUID } from "../__tests__/helpers";
import { paymentIntents } from "@workspace/db/schema";

const uids: string[] = [];

afterAll(async () => {
  await deleteUsers(...uids);
});

beforeEach(() => {
  createProviderChargeMock.mockReset();
});

describe("Paymob order binding + concurrent top-up (Round 10)", () => {
  it("findIntentIdByPaymobOrderId ignores remapped unsigned merchant ids", async () => {
    const userA = await createUser();
    const userB = await createUser();
    uids.push(userA, userB);
    const intentA = randomUUID();
    const intentB = randomUUID();
    const orderId = `order_${randomUUID().slice(0, 8)}`;

    await db.insert(paymentIntents).values([
      {
        id: intentA,
        userId: userA,
        amount: "100.00",
        method: "fawry",
        purpose: "wallet_topup",
        status: "pending",
        providerRef: "intention_a",
        metadata: { provider: "paymob", paymob_order_id: orderId },
      },
      {
        id: intentB,
        userId: userB,
        amount: "100.00",
        method: "fawry",
        purpose: "wallet_topup",
        status: "pending",
        providerRef: "intention_b",
        metadata: { provider: "paymob" },
      },
    ]);

    expect(await findIntentIdByPaymobOrderId(orderId)).toBe(intentA);
    expect(await claimPaymobOrderForIntent(intentB, orderId)).toBe(
      "order_bound_elsewhere",
    );
    expect(await findIntentIdByPaymobOrderId(orderId)).toBe(intentA);
  });

  it("concurrent createTopupIntent with same key opens Paymob once", async () => {
    const userId = await createUser();
    uids.push(userId);
    const key = randomUUID();

    let release!: () => void;
    const gate = new Promise<void>((r) => {
      release = r;
    });
    let calls = 0;
    createProviderChargeMock.mockImplementation(async (input: { intentId: string }) => {
      calls += 1;
      await gate;
      return {
        providerRef: `paymob_${input.intentId.slice(0, 8)}`,
        checkoutUrl: `https://accept.paymob.com/checkout/${input.intentId}`,
      };
    });

    const p1 = createTopupIntent({
      userId,
      amount: 300,
      method: "instapay",
      idempotencyKey: key,
    });
    await new Promise((r) => setTimeout(r, 40));
    const p2 = createTopupIntent({
      userId,
      amount: 300,
      method: "instapay",
      idempotencyKey: key,
    });

    release();
    const [a, b] = await Promise.all([p1, p2]);
    expect(a.checkout_url).toBeTruthy();
    expect(b.checkout_url).toBe(a.checkout_url);
    expect(a.provider_ref).toBe(b.provider_ref);
    expect(calls).toBe(1);

    const rows = await db
      .select()
      .from(paymentIntents)
      .where(eq(paymentIntents.id, key));
    expect(rows).toHaveLength(1);
  });
});

describe("Failed top-up resume preserves Paymob order bind (Round 12)", () => {
  it("refuses to reopen PSP when paymob_order_id is already bound", async () => {
    const userId = await createUser();
    uids.push(userId);
    const key = randomUUID();
    const orderId = `order_${randomUUID().slice(0, 8)}`;

    await db.insert(paymentIntents).values({
      id: key,
      userId,
      amount: "250.00",
      method: "fawry",
      purpose: "wallet_topup",
      status: "failed",
      providerRef: "intention_old",
      metadata: {
        provider: "paymob",
        paymob_order_id: orderId,
        charge_error: true,
      },
    });

    createProviderChargeMock.mockImplementation(async () => {
      throw new Error("must not open a second Paymob checkout");
    });

    await expect(
      createTopupIntent({
        userId,
        amount: 250,
        method: "fawry",
        idempotencyKey: key,
      }),
    ).rejects.toMatchObject({ code: "CONFLICT" });

    expect(createProviderChargeMock).not.toHaveBeenCalled();

    const [row] = await db
      .select()
      .from(paymentIntents)
      .where(eq(paymentIntents.id, key));
    expect(row.status).toBe("pending");
    expect(
      (row.metadata as Record<string, unknown>).paymob_order_id,
    ).toBe(orderId);
  });

  it("resumes a failed intent without an order id and keeps order on later bind", async () => {
    const userId = await createUser();
    uids.push(userId);
    const key = randomUUID();

    await db.insert(paymentIntents).values({
      id: key,
      userId,
      amount: "120.00",
      method: "instapay",
      purpose: "wallet_topup",
      status: "failed",
      providerRef: null,
      metadata: { provider: "paymob", charge_error: true },
    });

    createProviderChargeMock.mockResolvedValue({
      providerRef: "intention_new",
      checkoutUrl: `https://accept.paymob.com/checkout/${key}`,
    });

    const result = await createTopupIntent({
      userId,
      amount: 120,
      method: "instapay",
      idempotencyKey: key,
    });
    expect(result.checkout_url).toContain(key);
    expect(createProviderChargeMock).toHaveBeenCalledTimes(1);

    // Simulate webhook binding an order after checkout — metadata merge must
    // not be wiped by a subsequent charge_error-style replace.
    await claimPaymobOrderForIntent(key, "order_bound_after");
    const [bound] = await db
      .select()
      .from(paymentIntents)
      .where(eq(paymentIntents.id, key));
    expect(
      (bound.metadata as Record<string, unknown>).paymob_order_id,
    ).toBe("order_bound_after");
    expect(
      (bound.metadata as Record<string, unknown>).checkout_url,
    ).toBeTruthy();
  });

  it("merges paymob_order_id without wiping checkout_url (Round 13)", async () => {
    const userId = await createUser();
    uids.push(userId);
    const key = randomUUID();
    await db.insert(paymentIntents).values({
      id: key,
      userId,
      amount: "90.00",
      method: "fawry",
      purpose: "wallet_topup",
      status: "pending",
      providerRef: "intention_x",
      metadata: {
        provider: "paymob",
        checkout_url: "https://accept.paymob.com/checkout/keep-me",
        provider_opening: true,
      },
    });
    expect(await claimPaymobOrderForIntent(key, "order_merge_r13")).toBe("ok");
    const [row] = await db
      .select()
      .from(paymentIntents)
      .where(eq(paymentIntents.id, key));
    const meta = row.metadata as Record<string, unknown>;
    expect(meta.paymob_order_id).toBe("order_merge_r13");
    expect(meta.checkout_url).toBe("https://accept.paymob.com/checkout/keep-me");
    expect(meta.provider_opening).toBe(true);
  });
});
