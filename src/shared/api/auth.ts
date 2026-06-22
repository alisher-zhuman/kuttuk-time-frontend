import axios from "axios";

import { API_PATHS, API_URL } from "@shared/constants";
import { LogInPayloadSchema, LogInResponseSchema } from "@shared/schemas";
import type { LogInPayload, LogInResponse } from "@shared/types";

export const logIn = async (payload: LogInPayload): Promise<LogInResponse> => {
  const validPayload = LogInPayloadSchema.parse(payload);

  const { data } = await axios.post<unknown>(`${API_URL}${API_PATHS.LOG_IN}`, validPayload);
  
  return LogInResponseSchema.parse(data);
};
