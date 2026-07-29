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
