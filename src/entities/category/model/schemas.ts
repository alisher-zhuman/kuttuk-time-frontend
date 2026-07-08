import { z } from "zod";

export const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  order: z.number()
});

export const CategoriesSchema = z.array(CategorySchema);

export const AdminCategorySchema = z.object({
  id: z.number(),
  name: z.object({
    kg: z.string(),
    ru: z.string(),
    en: z.string()
  }),
  order: z.number()
});

export const AdminCategoriesSchema = z.array(AdminCategorySchema);
