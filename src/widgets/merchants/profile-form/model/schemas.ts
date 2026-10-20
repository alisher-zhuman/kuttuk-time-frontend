import { z } from "zod";

import type { MerchantOptions } from "@entities/merchant";

// Allowed nominals / validity come from the backend, so the schema is built per
// options response.
export const createMerchantProfileFormSchema = (options: MerchantOptions) =>
  z.object({
    logo: z.string().min(1, "merchant.form.logoRequired"),
    name: z.string().trim().min(1, "merchant.form.required"),
    descriptionRu: z.string().trim().min(1, "merchant.form.required"),
    descriptionKg: z.string().trim().min(1, "merchant.form.required"),
    descriptionEn: z.string().trim().min(1, "merchant.form.required"),
    categories: z.array(z.number()).min(1, "merchant.form.categoriesRequired"),
    nominals: z
      .array(z.number())
      .min(1, "merchant.form.nominalsRequired")
      // On the array, not each item: the form only renders errors.nominals, so a
      // per-item error would silently block submit.
      .refine((values) => values.every((value) => options.nominals.includes(value)), {
        message: "merchant.form.nominalsUnavailable"
      }),
    validityMonths: z
      .number()
      .refine((value) => options.validityMonths.includes(value), {
        message: "merchant.form.validityUnavailable"
      })
  });
