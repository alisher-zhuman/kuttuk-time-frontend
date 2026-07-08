import type { CategoryFormSchema } from "./schemas";

import type { z } from "zod";

export type CategoryFormValues = z.infer<typeof CategoryFormSchema>;
