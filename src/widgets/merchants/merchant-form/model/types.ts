import type { AdminMerchant } from "@entities/merchant";

import type { MerchantFormSchema } from "./schemas";

import type { z } from "zod";

export type MerchantFormValues = z.infer<typeof MerchantFormSchema>;

export type MerchantFormVariant = { kind: "create" } | { kind: "edit"; merchant: AdminMerchant };
