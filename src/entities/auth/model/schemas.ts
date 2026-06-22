import { z } from "zod";

import { UserRoleSchema } from "@shared/schemas";

export const LoginPayloadSchema = z.object({
  telegramId: z.number().positive(),
});

export const LoginResponseSchema = z.object({
  accessToken: z.string().min(1),
  role: UserRoleSchema,
});
