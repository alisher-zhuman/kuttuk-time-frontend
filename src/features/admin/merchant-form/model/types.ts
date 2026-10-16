import type { MerchantFormSchema } from "./schemas";

import type { z } from "zod";

export type MerchantFormValues = z.infer<typeof MerchantFormSchema>;
