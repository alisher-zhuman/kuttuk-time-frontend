import { z } from "zod";

export const OrderStatusSchema = z.enum(["pending", "paid", "expired", "needs_review"]);

export const CreatedOrderSchema = z.object({
  orderId: z.string(),
  paymentUrl: z.string(),
  expiresAt: z.string()
});

export const CertificateSchema = z.object({
  code: z.string(),
  validUntil: z.string()
});

export const OrderSchema = z.object({
  orderId: z.string(),
  status: OrderStatusSchema,
  amount: z.number(),
  merchantId: z.number(),
  // Only while pending — null once the order leaves that state.
  paymentUrl: z.string().nullable(),
  expiresAt: z.string(),
  paidAt: z.string().nullable(),
  // Only when paid; needs_review has money taken but no certificate yet.
  certificate: CertificateSchema.nullable()
});

// The backend parses ids with ParseUUIDPipe; checking up front turns a mangled
// URL into "not found" without a request.
export const isOrderId = (value: unknown): value is string =>
  z.uuid().safeParse(value).success;
