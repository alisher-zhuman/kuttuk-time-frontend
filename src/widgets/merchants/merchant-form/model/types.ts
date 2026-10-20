import type { AdminMerchantDetail } from "@entities/merchant";

import type { createMerchantFormSchema } from "./schemas";

import type { z } from "zod";

export type MerchantFormValues = z.infer<ReturnType<typeof createMerchantFormSchema>>;

// One form, three uses. The role decides the fields and the endpoint, not a
// separate copy of the form: the owner edits only the storefront of its own
// venue; slug, Telegram ID and active status stay with the admin.
export type MerchantFormVariant =
  | { kind: "create" }
  | { kind: "edit"; merchant: AdminMerchantDetail }
  | { kind: "own"; merchant: AdminMerchantDetail };
