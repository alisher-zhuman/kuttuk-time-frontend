import { z } from "zod";

export const CreatedOrderSchema = z.object({
  orderId: z.string(),
  paymentUrl: z.string(),
  expiresAt: z.string()
});

export const OrderCertificateSchema = z.object({
  // For «Подарить» (POST /certificates/:id/share) right from the order screen.
  id: z.string(),
  code: z.string(),
  validUntil: z.string()
});

const OrderBaseSchema = z.object({
  orderId: z.string(),
  amount: z.number(),
  venueId: z.number(),
  expiresAt: z.string()
});

export const ORDER_STATUSES = ["pending", "paid", "expired", "needs_review", "refunded"] as const;

export const isOrderStatus = (value: unknown): value is (typeof ORDER_STATUSES)[number] =>
  ORDER_STATUSES.includes(value as (typeof ORDER_STATUSES)[number]);

// GET /orders/:id (../backend/src/orders/orders.service.ts `findOwn`) always
// sends paymentUrl / paidAt / certificate, with null where the status has no
// value. Each variant lists only the fields its status guarantees — z.object
// strips the rest, so those nulls never reach the type or the components.
export const OrderSchema = z.discriminatedUnion("status", [
  OrderBaseSchema.extend({
    status: z.literal("pending"),
    // Set right after Finik returns it, before POST /orders responds — so any
    // order a client knows about has it while pending.
    paymentUrl: z.string()
  }),
  OrderBaseSchema.extend({
    status: z.literal("paid"),
    paidAt: z.string(),
    // Created by the Finik webhook in the same transaction that marks the
    // order paid (also when a needs_review order is honoured by hand — the
    // other manual outcome of needs_review is refunded).
    certificate: OrderCertificateSchema
  }),
  OrderBaseSchema.extend({
    status: z.literal("needs_review"),
    // Money was taken (webhook fills paidAt), but no certificate until a
    // manual review.
    paidAt: z.string()
  }),
  OrderBaseSchema.extend({
    status: z.literal("expired")
  }),
  // A needs_review order whose money was returned by hand, outside the system.
  // Terminal: neither the webhook nor the cron touch it. The backend still
  // sends paidAt, but the screen doesn't use it; no certificate, no payment URL.
  OrderBaseSchema.extend({
    status: z.literal("refunded")
  })
]);

// The backend parses ids with ParseUUIDPipe; checking up front turns a mangled
// URL into "not found" without a request.
export const isOrderId = (value: unknown): value is string =>
  z.uuid().safeParse(value).success;

// GET /admin/orders and /admin/orders/:id (../backend src/orders/admin-orders.service.ts).
// Status-dependent keys come only when set (never null): paidAt once the money
// arrived, certificateCode once a certificate exists — that's paid.
const AdminOrderBaseSchema = z.object({
  id: z.string(),
  amount: z.number(),
  createdAt: z.string(),
  venue: z.object({ id: z.number(), name: z.string() }),
  // The venue's owner at the moment of the sale — the one it's paid out to.
  merchant: z.object({ id: z.number(), name: z.string() })
});

export const AdminOrderSchema = z.discriminatedUnion("status", [
  AdminOrderBaseSchema.extend({ status: z.literal("pending") }),
  AdminOrderBaseSchema.extend({ status: z.literal("expired") }),
  AdminOrderBaseSchema.extend({
    status: z.literal("paid"),
    paidAt: z.string(),
    certificateCode: z.string(),
    // Set once the order is covered by a recorded payout.
    payoutId: z.string().optional()
  }),
  AdminOrderBaseSchema.extend({ status: z.literal("needs_review"), paidAt: z.string() }),
  // Refunded comes out of needs_review by hand — paidAt is expected but not
  // worth failing the whole list over.
  AdminOrderBaseSchema.extend({ status: z.literal("refunded"), paidAt: z.string().optional() })
]);

export const AdminOrderPageSchema = z.object({
  items: z.array(AdminOrderSchema),
  // null = the last page (keyset pages, the cursor is opaque).
  nextCursor: z.string().nullable()
});

const AdminOrderCertificateBaseSchema = z.object({ code: z.string(), validUntil: z.string() });

const AdminOrderExtraSchema = z.object({
  expiresAt: z.string(),
  finikTransactionId: z.string().optional(),
  buyer: z.object({ userId: z.number(), telegramId: z.number() }),
  // Present once a certificate exists (paid); status is effective.
  certificate: z
    .discriminatedUnion("status", [
      AdminOrderCertificateBaseSchema.extend({ status: z.literal("active") }),
      AdminOrderCertificateBaseSchema.extend({ status: z.literal("used"), usedAt: z.string() }),
      AdminOrderCertificateBaseSchema.extend({ status: z.literal("expired") })
    ])
    .optional(),
  // Every Finik webhook for the order, oldest first. `result` is
  // finik_webhook_events.result (nullable column); `amount` is read raw from
  // Finik's JSON body, so its type isn't guaranteed — normalized to a number or
  // null here, where an amount mismatch (needs_review) is what matters.
  webhooks: z.array(
    z.object({
      receivedAt: z.string(),
      result: z.string().nullable(),
      amount: z.unknown().transform((value) => {
        const parsed = typeof value === "string" && value.trim() !== "" ? Number(value) : value;

        return typeof parsed === "number" && Number.isFinite(parsed) ? parsed : null;
      })
    })
  ),
  // Manual decisions on needs_review (backend script), oldest first.
  resolutions: z.array(
    z.object({
      action: z.enum(["issue", "refunded"]),
      fromStatus: z.string(),
      toStatus: z.string(),
      certificateCode: z.string().optional(),
      note: z.string().optional(),
      resolvedBy: z.string(),
      resolvedAt: z.string()
    })
  )
});

export const AdminOrderDetailSchema = AdminOrderSchema.and(AdminOrderExtraSchema);
