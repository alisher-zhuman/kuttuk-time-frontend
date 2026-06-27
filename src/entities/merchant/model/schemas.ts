import { z } from "zod";

export const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  order: z.number(),
});

export const CategoriesSchema = z.array(CategorySchema);

export const MerchantSchema = z.object({
  id: z.number(),
  logo: z.string(),
  name: z.string(),
  minNominal: z.number(),
  description: z.string(),
});

export const MerchantsSchema = z.array(MerchantSchema);

export const MerchantDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  logo: z.string(),
  nominals: z.array(z.number()).nonempty(),
  validityMonths: z.number(),
});
