import { z } from "zod";

export const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  order: z.number(),
});

export const CategoriesSchema = z.array(CategorySchema);
