import type {
  LogInPayloadSchema,
  LogInResponseSchema,
  UserRoleSchema
} from "@shared/schemas";

import type { z } from "zod";

export type LogInPayload = z.infer<typeof LogInPayloadSchema>;
export type LogInResponse = z.infer<typeof LogInResponseSchema>;
export type UserRole = z.infer<typeof UserRoleSchema>;
