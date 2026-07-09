import { z } from "zod";

import {
  NOMINAL_MAX,
  NOMINAL_MIN,
  VALIDITY_MAX,
  VALIDITY_MIN
} from "@shared/constants";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const isIntegerInRange = (value: string, min: number, max: number) => {
  const parsed = Number(value);

  return Number.isInteger(parsed) && parsed >= min && parsed <= max;
};

export const MerchantFormSchema = z.object({
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
    .array(z.number().int().min(NOMINAL_MIN).max(NOMINAL_MAX))
    .min(1, "admin.merchants.form.nominalsRequired"),
  validityMonths: z
    .string()
    .trim()
    .refine((value) => isIntegerInRange(value, VALIDITY_MIN, VALIDITY_MAX), {
      message: "admin.merchants.form.validityInvalid"
    }),
  merchantTelegramId: z
    .string()
    .trim()
    .refine((value) => isIntegerInRange(value, 1, Number.MAX_SAFE_INTEGER), {
      message: "admin.merchants.form.telegramIdInvalid"
    })
});
