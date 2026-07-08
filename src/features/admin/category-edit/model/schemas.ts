import { z } from "zod";

export const CategoryEditFormSchema = z.object({
  ru: z.string().trim().min(1, "admin.categories.required"),
  kg: z.string().trim().min(1, "admin.categories.required"),
  en: z.string().trim().min(1, "admin.categories.required"),
});
