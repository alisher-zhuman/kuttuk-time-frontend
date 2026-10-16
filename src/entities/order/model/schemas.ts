import { z } from "zod";

export const CreatedOrderSchema = z.object({
  orderId: z.string(),
  paymentUrl: z.string(),
  expiresAt: z.string()
});

export const OrderCertificateSchema = z.object({
  code: z.string(),
  validUntil: z.string()
});

const OrderBaseSchema = z.object({
  orderId: z.string(),
  amount: z.number(),
  merchantId: z.number(),
  expiresAt: z.string()
});

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
    // order paid (also when a needs_review order is honoured by hand).
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
  })
]);

// The backend parses ids with ParseUUIDPipe; checking up front turns a mangled
// URL into "not found" without a request.
export const isOrderId = (value: unknown): value is string =>
  z.uuid().safeParse(value).success;
