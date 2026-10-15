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
  // null when the merchant has no description in the requested language —
  // a non-nullable schema would reject the whole list over one merchant.
  description: z.string().nullable()
});

export const MerchantsSchema = z.array(MerchantSchema);

export const MerchantDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  logo: z.string(),
  nominals: z.array(z.number()).nonempty(),
  validityMonths: z.number()
});

export const AdminMerchantDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z
    .object({
      ru: z.string(),
      kg: z.string(),
      en: z.string()
    })
    .nullable(),
  categories: z.array(z.number()),
  nominals: z.array(z.number()).nonempty(),
  validityMonths: z.number(),
  merchantTelegramId: z.number(),
  logo: z.string(),
  slug: z.string(),
  isActive: z.boolean(),
  createdAt: z.string()
});
