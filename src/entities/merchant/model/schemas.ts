import { z } from "zod";

export const AdminMerchantSchema = z.object({
  id: z.number(),
  name: z.string(),
  logo: z.string(),
  isActive: z.boolean()
});

export const AdminMerchantsSchema = z.array(AdminMerchantSchema);

export const MerchantSchema = z.object({
  id: z.number(),
  logo: z.string(),
  name: z.string(),
  minNominal: z.number(),
  description: z.string()
});

export const MerchantsSchema = z.array(MerchantSchema);

export const MerchantDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  logo: z.string(),
  nominals: z.array(z.number()).nonempty(),
  validityMonths: z.number()
});

export const AdminMerchantDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.object({
    ru: z.string(),
    kg: z.string(),
    en: z.string()
  }),
  categories: z.array(z.number()),
  nominals: z.array(z.number()).nonempty(),
  validityMonths: z.number(),
  merchantTelegramId: z.number(),
  logo: z.string(),
  slug: z.string(),
  isActive: z.boolean(),
  createdAt: z.string()
});

// GET /merchants/options (../backend merchants.controller `getOptions`):
// VALID_NOMINALS / VALID_VALIDITY_MONTHS, sorted ascending — the only source of
// allowed merchant values; the frontend keeps no list of its own.
export const MerchantOptionsSchema = z.object({
  nominals: z.array(z.number()).nonempty(),
  validityMonths: z.array(z.number()).nonempty()
});
