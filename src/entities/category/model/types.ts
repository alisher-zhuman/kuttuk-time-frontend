import type { AdminCategorySchema, CategorySchema } from "./schemas";

import type { z } from "zod";

export type Category = z.infer<typeof CategorySchema>;
export type AdminCategory = z.infer<typeof AdminCategorySchema>;
