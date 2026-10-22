import { z } from "zod";

const isIntegerInRange = (value: string, min: number, max: number) => {
  const parsed = Number(value);

  return Number.isInteger(parsed) && parsed >= min && parsed <= max;
};

export const MerchantFormSchema = z.object({
  name: z.string().trim().min(1, "merchantForm.required"),
  // Kept as the input's string; Telegram IDs exceed int32 but stay within
  // MAX_SAFE_INTEGER, so Number() is exact.
  telegramId: z
    .string()
    .trim()
    .refine((value) => isIntegerInRange(value, 1, Number.MAX_SAFE_INTEGER), {
      message: "merchantForm.telegramIdInvalid"
    }),
  isActive: z.boolean()
});
