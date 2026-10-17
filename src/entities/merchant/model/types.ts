import type {
  AdminMerchantDetailSchema,
  AdminMerchantSchema,
  MerchantDetailSchema,
  MerchantOptionsSchema,
  MerchantSchema
} from "./schemas";

import type { z } from "zod";

export type Merchant = z.infer<typeof MerchantSchema>;
export type MerchantDetail = z.infer<typeof MerchantDetailSchema>;
export type AdminMerchant = z.infer<typeof AdminMerchantSchema>;
export type AdminMerchantDetail = z.infer<typeof AdminMerchantDetailSchema>;
export type MerchantOptions = z.infer<typeof MerchantOptionsSchema>;
