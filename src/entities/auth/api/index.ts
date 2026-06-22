import { api } from "@shared/api";
import { API_PATHS } from "@shared/constants";

import type { LoginPayload, LoginResponse } from "../model";
import { LoginPayloadSchema, LoginResponseSchema } from "../model";

export const logIn = async (payload: LoginPayload): Promise<LoginResponse> => {
  const validPayload = LoginPayloadSchema.parse(payload);

  const response = await api.post(API_PATHS.LOGIN, validPayload);

  return LoginResponseSchema.parse(response.data);
};
