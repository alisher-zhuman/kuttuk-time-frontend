import type { createMerchantFormSchema } from "./schemas";

import type { z } from "zod";

export type MerchantFormValues = z.infer<ReturnType<typeof createMerchantFormSchema>>;
