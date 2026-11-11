import i18n from "i18next";

import axios, { isAxiosError } from "axios";

import { API_PATHS, API_URL, LOG_IN_TIMEOUT_MS } from "@shared/constants";
import { GuestLogInResponseSchema, WidgetLogInResponseSchema } from "@shared/schemas";
import type { TmaUserInfo, UserRole } from "@shared/types";

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
const signIn = async (): Promise<WebSignIn> => {
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

// One sign-in at a time. A guest's token is stored only when the backend
// answers, so two sign-ins started before that each made a new guest - the
// start and a 401 in this tab, or two tabs opened together. In this tab the
// callers share one promise; across tabs a Web Lock queues them, and the
// second reads the token the first one stored.
let pendingSignIn: Promise<WebSignIn> | null = null;

const oneAtATime = (run: () => Promise<WebSignIn>): Promise<WebSignIn> => {
  if (!pendingSignIn) {
    const locks = typeof navigator === "undefined" ? undefined : navigator.locks;

    pendingSignIn = (locks ? locks.request("kuttuk-time-sign-in", run) : run()).finally(() => {
      pendingSignIn = null;
    });
  }

  return pendingSignIn;
};

export const signInOnWebsite = () => oneAtATime(signIn);

// «Выйти»: forget the widget's data and go back to a quiet guest. The guest
// was merged into the Telegram account at sign-in, so this is a new, empty one.
export const signOutOnWebsite = () => {
  write(TELEGRAM_AUTH_KEY, null);

  return oneAtATime(logInAsGuest);
};

// Who signed in through the widget - the profile shows them like the Mini
// App's user. Null for a guest.
export const getWebsiteUser = (): TmaUserInfo | null => {
  const data = readTelegramAuth();

  const id = data?.["id"];

  if (!data || typeof id !== "number") return null;

  const text = (key: string) => {
    const value = data[key];

    return typeof value === "string" ? value : null;
  };

  return {
    id,
    fullName: [text("first_name"), text("last_name")].filter(Boolean).join(" "),
    username: text("username"),
    photoUrl: text("photo_url")
  };
};

// The backend's answer to a website guest buying or claiming a gift
// (../backend src/auth/require-telegram.ts): log in with Telegram first.
export const isTelegramRequired = (error: unknown) =>
  isAxiosError<{ error?: string }>(error) &&
  error.response?.status === 403 &&
  error.response.data?.error === "telegram_required";
