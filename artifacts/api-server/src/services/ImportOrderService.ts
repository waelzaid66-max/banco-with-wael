import { db } from "@workspace/db";
import { importOrders, listings, users } from "@workspace/db/schema";
import { and, eq, desc } from "drizzle-orm";
import { createNotification } from "./NotificationService";
import type { ImportOrder, ImportOrderListItem } from "../validators/schemas";

export interface CreateImportOrderInput {
  listing_id?: string;
  origin_country?: string;
  destination_country?: string;
  details?: Record<string, unknown>;
  budget_amount?: number;
  currency?: string;
  note?: string;
}

async function resolveUserId(clerkId: string): Promise<string> {
  const [user] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);
  if (!user)
    throw Object.assign(new Error("User not found"), { code: "UNAUTHORIZED" });
  return user.id;
}

function toDto(row: typeof importOrders.$inferSelect): ImportOrder {
  return {
    id: row.id,
    user_id: row.userId,
    listing_id: row.listingId ?? null,
    stage: row.stage,
    origin_country: row.originCountry ?? null,
    destination_country: row.destinationCountry ?? null,
    details: (row.details as Record<string, unknown> | null) ?? null,
    budget_amount: row.budgetAmount ?? null,
    quote_amount: row.quoteAmount ?? null,
    currency: row.currency ?? null,
    notes: row.notes ?? null,
    created_at: row.createdAt
      ? row.createdAt.toISOString()
      : new Date().toISOString(),
    updated_at: row.updatedAt ? row.updatedAt.toISOString() : null,
  };
}

// Create a car-import order from the buyer's request. Starts at stage "order"
// and fires a best-effort car_import notification to the buyer.
export async function createImportOrder(
  clerkId: string,
  input: CreateImportOrderInput
): Promise<{ id: string }> {
  const userId = await resolveUserId(clerkId);

  const [created] = await db
    .insert(importOrders)
    .values({
      userId,
      listingId: input.listing_id ?? null,
      originCountry: input.origin_country ?? null,
      destinationCountry: input.destination_country ?? null,
      details: input.details ?? null,
      budgetAmount:
        input.budget_amount != null ? String(input.budget_amount) : null,
      currency: input.currency ?? null,
      notes: input.note ?? null,
    })
    .returning({ id: importOrders.id });

  await createNotification({
    userId,
    type: "car_import",
    title: "Import request received",
    body: "We received your car-import request and started reviewing it.",
    // Deep-link target: the mobile app opens /import/order/<id> directly.
    data: { import_order_id: created.id },
  });

  return { id: created.id };
}

// The signed-in buyer's own import orders, newest first (drives the tracking
// screen). Enriched with the listing title when the order references a listing.
export async function listMyImportOrders(
  clerkId: string
): Promise<ImportOrderListItem[]> {
  const userId = await resolveUserId(clerkId);

  const rows = await db
    .select({
      id: importOrders.id,
      stage: importOrders.stage,
      origin_country: importOrders.originCountry,
      destination_country: importOrders.destinationCountry,
      budget_amount: importOrders.budgetAmount,
      currency: importOrders.currency,
      listing_title: listings.title,
      created_at: importOrders.createdAt,
      updated_at: importOrders.updatedAt,
    })
    .from(importOrders)
    .leftJoin(listings, eq(importOrders.listingId, listings.id))
    .where(eq(importOrders.userId, userId))
    .orderBy(desc(importOrders.createdAt));

  return rows.map((r) => ({
    id: r.id,
    stage: r.stage,
    origin_country: r.origin_country ?? null,
    destination_country: r.destination_country ?? null,
    budget_amount: r.budget_amount ?? null,
    currency: r.currency ?? null,
    listing_title: r.listing_title ?? null,
    created_at: r.created_at
      ? r.created_at.toISOString()
      : new Date().toISOString(),
    updated_at: r.updated_at ? r.updated_at.toISOString() : null,
  }));
}

const STAGE_TRANSITIONS: Record<string, string[]> = {
  order: ["review", "cancelled"],
  review: ["confirm", "cancelled"],
  confirm: ["shipping", "cancelled"],
  shipping: ["customs", "cancelled"],
  customs: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
};

export async function updateImportOrderStage(
  orderId: string,
  newStage: string,
  opts?: { quoteAmount?: number }
): Promise<ImportOrder> {
  const [row] = await db
    .select()
    .from(importOrders)
    .where(eq(importOrders.id, orderId))
    .limit(1);
  if (!row)
    throw Object.assign(new Error("Import order not found"), { code: "NOT_FOUND" });

  const allowed = STAGE_TRANSITIONS[row.stage] ?? [];
  if (!allowed.includes(newStage))
    throw Object.assign(
      new Error(`Cannot transition from "${row.stage}" to "${newStage}"`),
      { code: "INVALID_DATA" }
    );

  const updateData: Record<string, unknown> = {
    stage: newStage,
    updatedAt: new Date(),
  };
  if (opts?.quoteAmount != null) updateData.quoteAmount = String(opts.quoteAmount);

  const [updated] = await db
    .update(importOrders)
    .set(updateData)
    .where(and(eq(importOrders.id, orderId), eq(importOrders.stage, row.stage)))
    .returning();

  if (!updated) {
    throw Object.assign(new Error("Import order stage changed concurrently"), {
      code: "CONFLICT",
    });
  }

  const stageMessages: Record<string, string> = {
    review: "Your import order is under review.",
    confirm: "Your import order has been confirmed!",
    shipping: "Your vehicle is now shipping.",
    customs: "Your vehicle is in customs clearance.",
    delivered: "Your vehicle has been delivered!",
    cancelled: "Your import order has been cancelled.",
  };
  await createNotification({
    userId: updated.userId,
    type: "car_import",
    title: "Import order update",
    body: stageMessages[newStage] ?? `Order moved to ${newStage}.`,
    data: { import_order_id: updated.id },
  });

  return toDto(updated);
}

export async function cancelImportOrder(
  clerkId: string,
  orderId: string
): Promise<ImportOrder> {
  const userId = await resolveUserId(clerkId);
  const [row] = await db
    .select()
    .from(importOrders)
    .where(and(eq(importOrders.id, orderId), eq(importOrders.userId, userId)))
    .limit(1);
  if (!row)
    throw Object.assign(new Error("Import order not found"), { code: "NOT_FOUND" });

  const allowed = STAGE_TRANSITIONS[row.stage] ?? [];
  if (!allowed.includes("cancelled"))
    throw Object.assign(
      new Error(`Cannot cancel order in stage "${row.stage}"`),
      { code: "INVALID_DATA" }
    );

  const [updated] = await db
    .update(importOrders)
    .set({ stage: "cancelled", updatedAt: new Date() })
    .where(
      and(
        eq(importOrders.id, orderId),
        eq(importOrders.userId, userId),
        eq(importOrders.stage, row.stage),
      ),
    )
    .returning();

  if (!updated) {
    throw Object.assign(new Error("Import order stage changed concurrently"), {
      code: "CONFLICT",
    });
  }

  return toDto(updated);
}

// A single import order owned by the signed-in buyer (IDOR-scoped by userId).
export async function getImportOrder(
  clerkId: string,
  id: string
): Promise<ImportOrder | null> {
  const userId = await resolveUserId(clerkId);
  const [row] = await db
    .select()
    .from(importOrders)
    .where(and(eq(importOrders.id, id), eq(importOrders.userId, userId)))
    .limit(1);
  if (!row) return null;
  return toDto(row);
}
