import i18n from "i18next";

import axios from "axios";

import { API_PATHS, API_URL } from "@shared/constants";
import { LogInPayloadSchema, LogInResponseSchema } from "@shared/schemas";
import type { LogInPayload, LogInResponse } from "@shared/types";

export const logIn = async (payload: LogInPayload): Promise<LogInResponse> => {
  const validPayload = LogInPayloadSchema.parse(payload);

  // Plain axios (the api instance re-logs in through here), so the language
  // header is set by hand: the backend remembers it for the bot's messages.
  const response = await axios.post(`${API_URL}${API_PATHS.LOG_IN}`, validPayload, {
    headers: { "Accept-Language": i18n.language }
  });

  return LogInResponseSchema.parse(response.data);
};
