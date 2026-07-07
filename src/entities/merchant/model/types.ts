import type {
  AdminMerchantSchema,
  MerchantDetailSchema,
  MerchantSchema,
} from "./schemas";

import type { z } from "zod";

export type Merchant = z.infer<typeof MerchantSchema>;
export type MerchantDetail = z.infer<typeof MerchantDetailSchema>;
export type AdminMerchant = z.infer<typeof AdminMerchantSchema>;
