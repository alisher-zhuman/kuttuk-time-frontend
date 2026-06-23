import { z } from "zod";

export const CategoriesSchema = z.array(z.string());

export const MerchantSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  category: z.string(),
  minNominal: z.number(),
});

export const MerchantsSchema = z.array(MerchantSchema);
