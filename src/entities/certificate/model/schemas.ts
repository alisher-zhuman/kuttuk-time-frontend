import { z } from "zod";

// GET /certificates/my — contract agreed ahead of the backend endpoint; the
// backend implements exactly this shape.
const CertificateMerchantSchema = z.object({
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
  merchant: CertificateMerchantSchema
});

// expired is computed by the backend — the client never compares dates.
// usedAt exists only once the merchant marked it used.
export const CertificateSchema = z.discriminatedUnion("status", [
  CertificateBaseSchema.extend({ status: z.literal("active") }),
  CertificateBaseSchema.extend({ status: z.literal("used"), usedAt: z.string() }),
  CertificateBaseSchema.extend({ status: z.literal("expired") })
]);

export const CertificatesSchema = z.array(CertificateSchema);
