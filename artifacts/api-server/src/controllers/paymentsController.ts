import type { Request, Response } from "express";
import { verifyPaymobWebhook } from "../lib/paymentProvider";
import {
  getIntentMeta,
  claimPaymobOrderForIntent,
  findIntentIdByPaymobOrderId,
  settleTopupIntent,
  markTopupIntentFailed,
} from "../services/PaymentIntentService";
import {
  settleSubscriptionIntentByWebhook,
  markSubscriptionIntentFailed,
} from "../services/SubscriptionService";

/**
 * Paymob "transaction processed" webhook — the ONLY path that settles a
 * payment. The HMAC signature is verified before any field is trusted; an
 * invalid signature is rejected with 401 and never touches the ledger.
 *
 * Valid-but-unactionable deliveries (amount mismatch, already settled) are
 * acknowledged with 200 so the provider stops retrying. Unknown intents return
 * 503 so the provider retries (never ACK a signed payment with no durable row).
 * Genuine processing failures also return 500/503 for retry.
 */
export async function paymobWebhookHandler(req: Request, res: Response) {
  const body = (req.body ?? {}) as { obj?: Record<string, unknown> };
  const obj = body.obj ?? {};
  const providedHmac =
    typeof req.query.hmac === "string" ? req.query.hmac : undefined;

  const verification = await verifyPaymobWebhook({ obj, providedHmac });
  if (!verification.valid) {
    return res.status(401).json({ ok: false });
  }
  if (!verification.providerOrderId) {
    console.error("[Paymob webhook] signed payload missing order.id");
    return res.status(200).json({ ok: true });
  }

  try {
    // Prefer the already-bound intent for this signed order.id — never let an
    // unsigned merchant_order_id remap settlement onto a different intent.
    const boundIntentId = await findIntentIdByPaymobOrderId(
      verification.providerOrderId,
    );
    const intentId = boundIntentId ?? verification.intentId;
    if (!intentId) {
      console.warn("[Paymob webhook] signed but no intent id present");
      return res.status(200).json({ ok: true });
    }

    const meta = await getIntentMeta(intentId);
    if (!meta) {
      console.error(
        "[Paymob webhook] signed settlement for unknown intent",
        intentId,
      );
      return res.status(503).json({ ok: false, error: "intent_not_found" });
    }

    // Economic guards MUST run before claimPaymobOrderForIntent — otherwise a
    // wrong-amount webhook permanently binds order.id and strands the real pay.
    if (
      verification.amountCents == null ||
      !Number.isFinite(verification.amountCents) ||
      verification.amountCents <= 0
    ) {
      console.error(
        "[Paymob webhook] missing/invalid signed amount_cents for intent",
        intentId,
      );
      return res.status(200).json({ ok: true });
    }
    if (verification.currency !== "EGP") {
      console.error(
        "[Paymob webhook] non-EGP currency for intent",
        intentId,
        verification.currency,
      );
      return res.status(200).json({ ok: true });
    }
    if (Math.round(Number(meta.amount) * 100) !== verification.amountCents) {
      console.error(
        "[Paymob webhook] amount mismatch for intent",
        intentId,
      );
      return res.status(200).json({ ok: true });
    }

    const claim = await claimPaymobOrderForIntent(
      intentId,
      verification.providerOrderId,
    );
    if (claim === "not_found") {
      console.error(
        "[Paymob webhook] signed settlement for unknown intent",
        intentId,
      );
      return res.status(503).json({ ok: false, error: "intent_not_found" });
    }
    if (claim !== "ok") {
      console.error(
        "[Paymob webhook] order/intent binding rejected",
        claim,
        intentId,
        verification.providerOrderId,
      );
      return res.status(200).json({ ok: true });
    }

    if (verification.success) {
      if (meta.purpose === "subscription") {
        await settleSubscriptionIntentByWebhook(intentId, {
          providerTxnId: verification.providerTxnId,
        });
      } else {
        await settleTopupIntent(intentId, {
          providerTxnId: verification.providerTxnId,
        });
      }
    } else {
      if (meta.purpose === "subscription") {
        await markSubscriptionIntentFailed(intentId);
      } else {
        await markTopupIntentFailed(intentId);
      }
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("[Paymob webhook] settlement error", err);
    return res.status(500).json({ ok: false });
  }
}

/**
 * Post-checkout redirect landing. Paymob sends the buyer here after the hosted
 * checkout. Settlement is already handled by the webhook, so this is a tiny
 * "you can return to the app" page; the client polls intent status separately.
 */
export function paymentReturnHandler(_req: Request, res: Response) {
  res
    .status(200)
    .type("html")
    .send(
      `<!doctype html><html lang="en"><head><meta charset="utf-8" />` +
        `<meta name="viewport" content="width=device-width, initial-scale=1" />` +
        `<title>BANCO Payment</title>` +
        `<style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;` +
        `display:flex;min-height:100vh;align-items:center;justify-content:center;` +
        `margin:0;background:#0b0b0c;color:#fafafa;text-align:center;padding:24px}` +
        `.c{max-width:340px}h1{font-size:20px;margin:0 0 8px}p{opacity:.7;line-height:1.5}` +
        `</style></head><body><div class="c"><h1>Payment received</h1>` +
        `<p>You can close this window and return to the BANCO app. ` +
        `Your balance will update automatically.</p></div></body></html>`
    );
}
