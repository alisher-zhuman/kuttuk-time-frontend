import i18n from "i18next";

import axios, { isAxiosError } from "axios";

import { API_PATHS, API_URL, LOG_IN_TIMEOUT_MS } from "@shared/constants";
import { GuestLogInResponseSchema, WidgetLogInResponseSchema } from "@shared/schemas";
import type { UserRole } from "@shared/types";

// The website's sign-in (../backend docs/web-version.md). The JWT stays in
// memory (useAuthStore); the browser keeps only what signs in again:
// - the guest's secret - the same guest, their orders and certificates;
// - the Telegram Login Widget's data - valid for 24 h, reused until the
//   backend answers 401.
const GUEST_TOKEN_KEY = "kuttuk-time-guest-token";
const TELEGRAM_AUTH_KEY = "kuttuk-time-telegram-auth";

// What the widget hands over (id, first_name, auth_date, hash, …) - sent back
// unchanged: the backend checks its signature.
export type TelegramAuthData = Record<string, string | number>;

export interface WebSignIn {
  accessToken: string;
  role: UserRole;
  isGuest: boolean;
}

// Private mode / blocked storage: works for this visit, a new guest next time.
const read = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const write = (key: string, value: string | null) => {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    // Nothing to keep it in - fine for this visit.
  }
};

const readTelegramAuth = (): TelegramAuthData | null => {
  try {
    return JSON.parse(read(TELEGRAM_AUTH_KEY) ?? "null") as TelegramAuthData | null;
  } catch {
    return null;
  }
};

// Plain axios like log-in (the api instance re-signs in through here); the
// language header by hand - the backend remembers it for the bot.
const post = (path: string, body: object) =>
  axios.post(`${API_URL}${path}`, body, {
    headers: { "Accept-Language": i18n.language },
    timeout: LOG_IN_TIMEOUT_MS
  });

export const logInAsGuest = async (): Promise<WebSignIn> => {
  const guestToken = read(GUEST_TOKEN_KEY);

  const response = await post(API_PATHS.GUEST_LOG_IN, guestToken ? { guestToken } : {});
  const data = GuestLogInResponseSchema.parse(response.data);

  // A known token comes back the same; an unknown one - a new guest's.
  write(GUEST_TOKEN_KEY, data.guestToken);

  return { accessToken: data.accessToken, role: data.role, isGuest: true };
};

// «Войти через Telegram»: with the guest's token the backend moves their
// purchases to the Telegram account and deletes the guest - so its token goes
// too, and the caller must switch to the new JWT at once.
export const logInWithTelegramWidget = async (authData: TelegramAuthData) => {
  const guestToken = read(GUEST_TOKEN_KEY);

  const response = await post(API_PATHS.WIDGET_LOG_IN, { authData, ...(guestToken && { guestToken }) });
  const data = WidgetLogInResponseSchema.parse(response.data);

  write(TELEGRAM_AUTH_KEY, JSON.stringify(authData));
  write(GUEST_TOKEN_KEY, null);

  return { accessToken: data.accessToken, role: data.role, isGuest: false, merged: data.merged };
};

// At start and on a 401: Telegram while the widget's data still works, else
// the guest. A 401 on the widget's data (older than 24 h) drops it - the
// «Войти через Telegram» button shows again.
export const signInOnWebsite = async (): Promise<WebSignIn> => {
  const telegramAuth = readTelegramAuth();

  if (telegramAuth) {
    try {
      const { accessToken, role, isGuest } = await logInWithTelegramWidget(telegramAuth);

      return { accessToken, role, isGuest };
    } catch (error) {
      if (!(isAxiosError(error) && error.response?.status === 401)) throw error;

      write(TELEGRAM_AUTH_KEY, null);
    }
  }

  return logInAsGuest();
};
