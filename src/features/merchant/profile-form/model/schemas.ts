import { z } from "zod";

import { NOMINAL_PRESETS, VALIDITY_PRESETS } from "@shared/constants";

export const MerchantProfileFormSchema = z.object({
  logo: z.string().min(1, "merchant.form.logoRequired"),
  name: z.string().trim().min(1, "merchant.form.required"),
  descriptionRu: z.string().trim().min(1, "merchant.form.required"),
  descriptionKg: z.string().trim().min(1, "merchant.form.required"),
  descriptionEn: z.string().trim().min(1, "merchant.form.required"),
  categories: z.array(z.number()).min(1, "merchant.form.categoriesRequired"),
  nominals: z
    .array(
      z
        .number()
        .refine((value) => (NOMINAL_PRESETS as readonly number[]).includes(value))
    )
    .min(1, "merchant.form.nominalsRequired"),
  validityMonths: z
    .number()
    .refine((value) => (VALIDITY_PRESETS as readonly number[]).includes(value))
});
