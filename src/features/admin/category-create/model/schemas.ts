import { z } from "zod";

export const CategoryFormSchema = z.object({
  ru: z.string().trim().min(1, "admin.categories.required"),
  kg: z.string().trim().min(1, "admin.categories.required"),
  en: z.string().trim().min(1, "admin.categories.required"),
  order: z
    .string()
    .trim()
    .refine((value) => value === "" || (!Number.isNaN(Number(value)) && Number(value) >= 0), {
      message: "admin.categories.orderInvalid",
    }),
});

