import type { LogInPayloadSchema, LogInResponseSchema } from "@shared/schemas";

import type { z } from "zod";

export type LogInPayload = z.infer<typeof LogInPayloadSchema>;
export type LogInResponse = z.infer<typeof LogInResponseSchema>;
