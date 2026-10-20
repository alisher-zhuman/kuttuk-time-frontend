import { z } from "zod";

import type { MerchantOptions } from "@entities/merchant";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const isIntegerInRange = (value: string, min: number, max: number) => {
  const parsed = Number(value);

  return Number.isInteger(parsed) && parsed >= min && parsed <= max;
};

// Allowed nominals / validity come from the backend, so the schema is built per
// options response. withAdminFields: slug / Telegram ID are validated only when
// the admin edits them — the owner's form doesn't show or send them, and its
// values just carry the merchant's own through untouched.
export const createMerchantFormSchema = (options: MerchantOptions, withAdminFields: boolean) =>
  z.object({
    logo: z.string().min(1, "merchantForm.logoRequired"),
    name: z.string().trim().min(1, "merchantForm.required"),
    slug: withAdminFields
      ? z
          .string()
          .trim()
          .min(1, "merchantForm.required")
          .regex(SLUG_PATTERN, "merchantForm.slugInvalid")
      : z.string(),
    descriptionRu: z.string().trim().min(1, "merchantForm.required"),
    descriptionKg: z.string().trim().min(1, "merchantForm.required"),
    descriptionEn: z.string().trim().min(1, "merchantForm.required"),
    categories: z.array(z.number()).min(1, "merchantForm.categoriesRequired"),
    nominals: z
      .array(z.number())
      .min(1, "merchantForm.nominalsRequired")
      // On the array, not each item: the form only renders errors.nominals, so a
      // per-item error would silently block submit.
      .refine((values) => values.every((value) => options.nominals.includes(value)), {
        message: "merchantForm.nominalsUnavailable"
      }),
    validityMonths: z
      .number()
      .refine((value) => options.validityMonths.includes(value), {
        message: "merchantForm.validityUnavailable"
      }),
    isActive: z.boolean(),
    merchantTelegramId: withAdminFields
      ? z
          .string()
          .trim()
          .refine((value) => isIntegerInRange(value, 1, Number.MAX_SAFE_INTEGER), {
            message: "merchantForm.telegramIdInvalid"
          })
      : z.string()
  });
