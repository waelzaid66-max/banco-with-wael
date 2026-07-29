import { randomUUID } from "node:crypto";
import { db } from "@workspace/db";
import { paymentIntents, transactions, users } from "@workspace/db/schema";
import { and, eq, inArray, isNull } from "drizzle-orm";
import {
  applyTransaction,
  getWalletBalance,
  type LedgerPaymentMethod,
} from "./WalletService";
import { createProviderCharge, type EgyptianRail } from "../lib/paymentProvider";
import { invalidData, isUniqueViolation, notFound, toMoney } from "../lib/billing";
import { schedulePaymentSuccess, notifyPaymentIntentFailed } from "./BillingNotificationService";

export type TopupMethod = EgyptianRail;

export interface CreateTopupInput {
  userId: string;
  amount: number;
  method: TopupMethod;
}

export interface TopupIntentResult {
  intent_id: string;
  amount: string;
  method: string;
  status: string;
  provider_ref: string | null;
  /** Hosted checkout URL the buyer is sent to in order to pay. */
  checkout_url: string | null;
  created_at: string;
}

export interface ConfirmTopupResult {
  intent_id: string;
  status: string;
  transaction_id: string | null;
  balance: string;
  already_processed: boolean;
}

/**
 * Create a pending wallet top-up intent against the real PSP (Paymob).
 *
 * Durable intent row is inserted FIRST so a process crash / DB blip after the
 * PSP charge cannot leave a paid checkout with no settleable intent (webhook
 * would otherwise ACK an unknown merchant reference and strand money).
 * Provider charge is opened second; checkout URL is patched onto the row.
 */
export async function createTopupIntent(
  input: CreateTopupInput
): Promise<TopupIntentResult> {
  const amount = toMoney(input.amount);
  if (Number(amount) <= 0) throw invalidData("Top-up amount must be positive");

  const intentId = randomUUID();
  const [intent] = await db
    .insert(paymentIntents)
    .values({
      id: intentId,
      userId: input.userId,
      amount,
      method: input.method,
      purpose: "wallet_topup",
      status: "pending",
      providerRef: null,
      metadata: { provider: "paymob" },
    })
    .returning();

  let charge;
  try {
    charge = await createProviderCharge({
      amount,
      method: input.method,
      intentId,
      purpose: "wallet_topup",
      userId: input.userId,
      description: `Wallet top-up (${input.method})`,
    });
  } catch (err) {
    await db
      .update(paymentIntents)
      .set({ status: "failed", metadata: { provider: "paymob", charge_error: true } })
      .where(and(eq(paymentIntents.id, intentId), eq(paymentIntents.status, "pending")));
    throw err;
  }

  const [updated] = await db
    .update(paymentIntents)
    .set({
      providerRef: charge.providerRef,
      metadata: { provider: "paymob", checkout_url: charge.checkoutUrl },
    })
    .where(eq(paymentIntents.id, intentId))
    .returning();

  const row = updated ?? intent;
  return {
    intent_id: row.id,
    amount: row.amount,
    method: row.method,
    status: row.status,
    provider_ref: row.providerRef,
    checkout_url: charge.checkoutUrl,
    created_at: (row.createdAt ?? new Date()).toISOString(),
  };
}

async function findTransactionByKey(key: string): Promise<string | null> {
  const [row] = await db
    .select({ id: transactions.id })
    .from(transactions)
    .where(eq(transactions.idempotencyKey, key))
    .limit(1);
  return row?.id ?? null;
}

/** Lightweight metadata used by the webhook to route + tamper-check a settlement. */
export async function getIntentMeta(
  intentId: string
): Promise<{ purpose: string; amount: string; status: string } | null> {
  const [intent] = await db
    .select({
      purpose: paymentIntents.purpose,
      amount: paymentIntents.amount,
      status: paymentIntents.status,
    })
    .from(paymentIntents)
    .where(eq(paymentIntents.id, intentId))
    .limit(1);
  return intent ?? null;
}

/**
 * Read-only status of a wallet top-up intent. This is what the client polls
 * after the buyer returns from the hosted checkout — it NEVER settles. Money
 * only moves through the verified provider webhook (`settleTopupIntent`).
 *
 * IDOR: a mismatched owner reads as "not found" (no existence leak).
 */
export async function getTopupIntentStatus(
  intentId: string,
  userId: string
): Promise<ConfirmTopupResult> {
  const [intent] = await db
    .select()
    .from(paymentIntents)
    .where(eq(paymentIntents.id, intentId))
    .limit(1);

  if (!intent || intent.userId !== userId) {
    throw notFound("Payment intent not found");
  }
  if (intent.purpose !== "wallet_topup") {
    throw invalidData("Not a wallet top-up intent");
  }

  const transactionId =
    intent.status === "completed" ? await findTransactionByKey(intent.id) : null;
  const balance = await getWalletBalance(userId);

  return {
    intent_id: intent.id,
    status: intent.status,
    transaction_id: transactionId,
    balance,
    already_processed: intent.status === "completed",
  };
}

/**
 * Settle a wallet top-up intent — invoked ONLY by the verified provider webhook.
 * Credits the wallet and marks the intent completed atomically.
 *
 * Idempotency: the ledger credit uses idempotencyKey = intent.id, so repeated
 * webhook deliveries credit exactly once. The fast-path (`completed` short
 * circuit), the existing-key replay in applyTransaction, and the UNIQUE
 * constraint (concurrent race → 23505) all resolve to a no-op.
 */
export async function settleTopupIntent(
  intentId: string,
  opts: { providerTxnId?: string | null } = {}
): Promise<void> {
  const [intent] = await db
    .select()
    .from(paymentIntents)
    .where(eq(paymentIntents.id, intentId))
    .limit(1);

  if (!intent) throw notFound("Payment intent not found");
  if (intent.purpose !== "wallet_topup") {
    throw invalidData("Not a wallet top-up intent");
  }
  if (intent.status === "completed") return; // idempotent replay
  // Verified success webhooks must still credit after a premature/out-of-order
  // failure mark — otherwise the buyer paid at the PSP with no wallet credit.
  if (intent.status !== "pending" && intent.status !== "failed") {
    throw invalidData(`Cannot settle a ${intent.status} intent`);
  }

  // Soft-deleted owners must not receive wallet credit from late PSP webhooks.
  const [owner] = await db
    .select({ id: users.id })
    .from(users)
    .where(and(eq(users.id, intent.userId), isNull(users.deletedAt)))
    .limit(1);
  if (!owner) {
    await db
      .update(paymentIntents)
      .set({ status: "failed" })
      .where(
        and(
          eq(paymentIntents.id, intent.id),
          inArray(paymentIntents.status, ["pending", "failed"]),
        ),
      );
    return;
  }

  try {
    const applied = await db.transaction(async (tx) => {
      const result = await applyTransaction(tx, {
        userId: intent.userId,
        type: "wallet_topup",
        direction: "credit",
        amount: intent.amount,
        paymentMethod: intent.method as LedgerPaymentMethod,
        referenceType: "payment_intent",
        referenceId: intent.id,
        description: `Wallet top-up via ${intent.method}`,
        idempotencyKey: intent.id,
        metadata: opts.providerTxnId
          ? { provider_txn_id: opts.providerTxnId }
          : null,
        invoice: {
          lineItems: [
            { label: `Wallet top-up (${intent.method})`, amount: intent.amount },
          ],
        },
      });

      await tx
        .update(paymentIntents)
        .set({ status: "completed", completedAt: new Date() })
        .where(
          and(
            eq(paymentIntents.id, intent.id),
            inArray(paymentIntents.status, ["pending", "failed"]),
          ),
        );

      return result;
    });

    if (!applied.replayed) {
      schedulePaymentSuccess({
        userId: intent.userId,
        kind: "wallet_topup",
        amount: intent.amount,
        balanceAfter: applied.balanceAfter,
        transactionId: applied.transactionId,
        description: `Wallet top-up via ${intent.method}`,
      });
    }
  } catch (err) {
    // Concurrent delivery already credited under the same idempotency key.
    if (isUniqueViolation(err)) return;
    throw err;
  }
}

/** Mark a pending top-up intent failed (cancelled/declined webhook). No money moves. */
export async function markTopupIntentFailed(intentId: string): Promise<void> {
  const updated = await db
    .update(paymentIntents)
    .set({ status: "failed" })
    .where(
      and(eq(paymentIntents.id, intentId), eq(paymentIntents.status, "pending"))
    )
    .returning({ id: paymentIntents.id });

  if (updated.length > 0) {
    await notifyPaymentIntentFailed(intentId);
  }
}
