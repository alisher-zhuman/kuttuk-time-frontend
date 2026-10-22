import { z } from "zod";

// GET /certificates/my — contract agreed ahead of the backend endpoint; the
// backend implements exactly this shape.
const CertificateVenueSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  logo: z.string()
});

const CertificateBaseSchema = z.object({
  id: z.string(),
  code: z.string(),
  amount: z.number(),
  validUntil: z.string(),
  createdAt: z.string(),
  venue: CertificateVenueSchema
});

// expired is computed by the backend — the client never compares dates.
// usedAt exists only once the merchant marked it used.
export const CertificateSchema = z.discriminatedUnion("status", [
  CertificateBaseSchema.extend({ status: z.literal("active") }),
  CertificateBaseSchema.extend({ status: z.literal("used"), usedAt: z.string() }),
  CertificateBaseSchema.extend({ status: z.literal("expired") })
]);

export const CertificatesSchema = z.array(CertificateSchema);

// GET /merchants/me/certificates/:code and POST …/redeem (../backend
// src/certificates/redemption.service.ts): the merchant's view of its own
// certificate. Effective status (active past validUntil → expired), usedAt only
// on used — same rules as the buyer's list.
// Which of the merchant's venues sold it — one merchant can own several.
const MerchantCertificateBaseSchema = z.object({
  code: z.string(),
  amount: z.number(),
  validUntil: z.string(),
  createdAt: z.string(),
  venue: z.object({ id: z.number(), name: z.string() })
});

export const MerchantCertificateSchema = z.discriminatedUnion("status", [
  MerchantCertificateBaseSchema.extend({ status: z.literal("active") }),
  MerchantCertificateBaseSchema.extend({ status: z.literal("used"), usedAt: z.string() }),
  MerchantCertificateBaseSchema.extend({ status: z.literal("expired") })
]);

// 409 body from POST …/redeem and POST /certificates/:id/share: the
// certificate is no longer active, `error` says why.
export const RedeemConflictSchema = z.object({
  error: z.enum(["already_used", "expired"])
});

// GET /merchants/me/certificates — newest first, keyset pages. nextCursor is
// opaque (pass it back as cursor); null is the backend's "last page"
// (MerchantCertificatePage.nextCursor: string | null).
export const MerchantCertificatePageSchema = z.object({
  items: z.array(MerchantCertificateSchema),
  nextCursor: z.string().nullable()
});

// POST /certificates/:id/share — a card stored with Telegram for shareMessage.
// Short-lived: ask for a new one on every tap.
export const PreparedGiftSchema = z.object({ preparedMessageId: z.string() });
