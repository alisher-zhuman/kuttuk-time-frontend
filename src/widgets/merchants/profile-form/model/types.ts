import type { createMerchantProfileFormSchema } from "./schemas";

import type { z } from "zod";

export type MerchantProfileFormValues = z.infer<ReturnType<typeof createMerchantProfileFormSchema>>;
