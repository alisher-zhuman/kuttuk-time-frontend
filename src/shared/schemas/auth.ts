import { z } from "zod";

import { UserRoleSchema } from "./user-role";

export const LogInPayloadSchema = z.object({
  telegramId: z.number().positive(),
});

export const LogInResponseSchema = z.object({
  accessToken: z.string().min(1),
  role: UserRoleSchema,
});
