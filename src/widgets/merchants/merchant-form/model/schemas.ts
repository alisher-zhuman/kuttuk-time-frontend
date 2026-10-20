import { z } from "zod";

import type { MerchantOptions } from "@entities/merchant";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const isIntegerInRange = (value: string, min: number, max: number) => {
  const parsed = Number(value);

  return Number.isInteger(parsed) && parsed >= min && parsed <= max;
};

// Allowed nominals / validity come from the backend, so the schema is built per
// options response.
export const createMerchantFormSchema = (options: MerchantOptions) =>
  z.object({
    logo: z.string().min(1, "admin.merchants.form.logoRequired"),
    name: z.string().trim().min(1, "admin.merchants.form.required"),
    slug: z
      .string()
      .trim()
      .min(1, "admin.merchants.form.required")
      .regex(SLUG_PATTERN, "admin.merchants.form.slugInvalid"),
    descriptionRu: z.string().trim().min(1, "admin.merchants.form.required"),
    descriptionKg: z.string().trim().min(1, "admin.merchants.form.required"),
    descriptionEn: z.string().trim().min(1, "admin.merchants.form.required"),
    categories: z.array(z.number()).min(1, "admin.merchants.form.categoriesRequired"),
    nominals: z
      .array(z.number())
      .min(1, "admin.merchants.form.nominalsRequired")
      // On the array, not each item: the form only renders errors.nominals, so a
      // per-item error would silently block submit.
      .refine((values) => values.every((value) => options.nominals.includes(value)), {
        message: "admin.merchants.form.nominalsUnavailable"
      }),
    validityMonths: z
      .number()
      .refine((value) => options.validityMonths.includes(value), {
        message: "admin.merchants.form.validityUnavailable"
      }),
    isActive: z.boolean(),
    merchantTelegramId: z
      .string()
      .trim()
      .refine((value) => isIntegerInRange(value, 1, Number.MAX_SAFE_INTEGER), {
        message: "admin.merchants.form.telegramIdInvalid"
      })
  });
