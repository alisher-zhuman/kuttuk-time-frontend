import type { CategoryEditFormSchema } from "./schemas";

import type { z } from "zod";

export type CategoryEditFormValues = z.infer<typeof CategoryEditFormSchema>;
