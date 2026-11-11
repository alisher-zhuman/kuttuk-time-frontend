import { z } from "zod";

// GET /certificates/my - contract agreed ahead of the backend endpoint; the
// backend implements exactly this shape.
const CertificateVenueSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  logo: z.string(),
  // Nullable venue columns (../backend src/venues/entities/venue.entity.ts):
  // where to use the certificate. null = not filled in.
  address: z.string().nullable(),
  mapUrl: z.string().nullable()
});

const CertificateBaseSchema = z.object({
  id: z.string(),
  code: z.string(),
  amount: z.number(),
  validUntil: z.string(),
  createdAt: z.string(),
  venue: CertificateVenueSchema,
  // Given away and claimed by a friend (../backend certificates.service.ts:
  // the key only on such a row). No code / QR / «Подарить» then; status still
  // says whether the friend used it.
  giftedAt: z.string().optional()
});

// expired is computed by the backend - the client never compares dates.
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
// on used - same rules as the buyer's list.
// Which of the merchant's venues sold it - one merchant can own several.
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

// GET /merchants/me/certificates - newest first, keyset pages. nextCursor is
// opaque (pass it back as cursor); null is the backend's "last page"
// (MerchantCertificatePage.nextCursor: string | null).
export const MerchantCertificatePageSchema = z.object({
  items: z.array(MerchantCertificateSchema),
  nextCursor: z.string().nullable()
});

// POST /certificates/:id/share - a card stored with Telegram for shareMessage.
// Short-lived: ask for a new one on every tap.
export const PreparedGiftSchema = z.object({ preparedMessageId: z.string() });

// GET /gifts/:token (../backend src/certificates/gifts.service.ts) - a gift
// link as the person who opened it sees it. No code: only claiming gives it.
// state: available - can be claimed while status is active; own - the
// caller's own link; received - the caller claimed it; claimed - someone else.
export const GiftSchema = z.object({
  state: z.enum(["available", "own", "received", "claimed"]),
  // The giver's first name from Telegram (../backend gifts.service.ts) - null
  // when Telegram had none to give.
  from: z.string().nullable(),
  status: z.enum(["active", "used", "expired"]),
  amount: z.number(),
  validUntil: z.string(),
  venue: CertificateVenueSchema
});

// 409 from POST /gifts/:token/claim - the link changed since it was shown.
export const GiftConflictSchema = z.object({
  error: z.enum(["own", "already_claimed", "already_used", "expired"])
});
