import type { LoginPayloadSchema, LoginResponseSchema } from "./schemas";

import type { z } from "zod";

export type LoginPayload = z.infer<typeof LoginPayloadSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
