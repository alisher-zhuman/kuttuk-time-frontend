import type {
  AdminMerchantDetailSchema,
  AdminMerchantSchema,
  MerchantMeSchema,
  MerchantWeekSummarySchema
} from "./schemas";

import type { z } from "zod";

export type MerchantMe = z.infer<typeof MerchantMeSchema>;
export type AdminMerchant = z.infer<typeof AdminMerchantSchema>;
export type AdminMerchantDetail = z.infer<typeof AdminMerchantDetailSchema>;
export type MerchantWeekSummary = z.infer<typeof MerchantWeekSummarySchema>;
