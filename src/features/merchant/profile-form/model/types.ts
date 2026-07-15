import type { MerchantProfileFormSchema } from "./schemas";

import type { z } from "zod";

export type MerchantProfileFormValues = z.infer<typeof MerchantProfileFormSchema>;
