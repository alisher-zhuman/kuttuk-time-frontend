import i18n from "i18next";

import { z } from "zod";

import axios, { isAxiosError } from "axios";

import { API_PATHS, API_URL, LOG_IN_TIMEOUT_MS } from "@shared/constants";
import { GuestLogInResponseSchema, TelegramLogInResponseSchema, UserRoleSchema } from "@shared/schemas";
import type { TmaUserInfo, UserRole } from "@shared/types";

// The website's sign-in (../backend docs/web-version.md). The browser keeps:
// - the guest's secret - the same guest, their orders and certificates;
// - after «Войти через Telegram» (Log In With Telegram, OIDC): our own JWT
//   and who it is, until the JWT stops working. Telegram's id_token is
//   short-lived and never kept - an expired session becomes a quiet guest, and
//   the next purchase asks to sign in with Telegram again.
const GUEST_TOKEN_KEY = "kuttuk-time-guest-token";
const TELEGRAM_SESSION_KEY = "kuttuk-time-telegram-session";
// The old Login Widget's data - removed from every browser at start.
const LEGACY_TELEGRAM_AUTH_KEY = "kuttuk-time-telegram-auth";

export interface WebSignIn {
  accessToken: string;
  role: UserRole;
  isGuest: boolean;
}

const TelegramSessionSchema = z.object({
  accessToken: z.string().min(1),
  role: UserRoleSchema,
  user: z.object({
    id: z.number(),
    fullName: z.string(),
    username: z.string().nullable(),
    photoUrl: z.string().nullable()
  })
});

type TelegramSession = z.infer<typeof TelegramSessionSchema>;

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

// The JWT's own expiry (seconds) - an expired session isn't even tried.
const isExpired = (jwt: string) => {
  try {
    const payload = JSON.parse(atob(jwt.split(".")[1]!.replace(/-/g, "+").replace(/_/g, "/"))) as { exp?: number };

    return typeof payload.exp === "number" && payload.exp * 1000 <= Date.now();
  } catch {
    return false;
  }
};

const readTelegramSession = (): TelegramSession | null => {
  try {
    const session = TelegramSessionSchema.safeParse(JSON.parse(read(TELEGRAM_SESSION_KEY) ?? "null"));

    return session.success && !isExpired(session.data.accessToken) ? session.data : null;
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

// What Telegram.Login hands over with the id_token: its decoded claims
// (https://core.telegram.org/bots/telegram-login - id, name, preferred_username,
// picture). Only shown in the profile; the backend trusts the token alone.
export type TelegramLoginClaims = Record<string, unknown>;

const toUser = (claims: TelegramLoginClaims): TelegramSession["user"] => {
  const text = (key: string) => (typeof claims[key] === "string" && claims[key] ? claims[key] : null);
  const id = Number(claims["id"] ?? claims["sub"]);

  return {
    id: Number.isSafeInteger(id) ? id : 0,
    fullName: text("name") ?? [text("given_name"), text("family_name")].filter(Boolean).join(" "),
    username: text("preferred_username"),
    photoUrl: text("picture")
  };
};

// «Войти через Telegram»: Telegram's id_token with the guest's token - the
// backend moves the guest's purchases to the Telegram account and deletes the
// guest, so its token goes too, and the caller must switch to the new JWT at
// once. 401 / 400 - Telegram's token was refused.
export const logInWithTelegram = async (idToken: string, claims: TelegramLoginClaims): Promise<WebSignIn> => {
  const guestToken = read(GUEST_TOKEN_KEY);

  const response = await post(API_PATHS.TELEGRAM_LOG_IN, { idToken, ...(guestToken && { guestToken }) });
  const data = TelegramLogInResponseSchema.parse(response.data);

  const session: TelegramSession = { accessToken: data.accessToken, role: data.role, user: toUser(claims) };
  write(TELEGRAM_SESSION_KEY, JSON.stringify(session));
  write(GUEST_TOKEN_KEY, null);

  return { accessToken: data.accessToken, role: data.role, isGuest: false };
};

// At start and on a 401: the Telegram session while its JWT lives, else the
// guest. afterRejection - the backend just refused the current JWT: a kept
// session is dropped (a quiet guest; the next purchase asks to sign in again).
const signIn = (afterRejection: boolean) => async (): Promise<WebSignIn> => {
  write(LEGACY_TELEGRAM_AUTH_KEY, null);

  if (afterRejection) write(TELEGRAM_SESSION_KEY, null);

  const session = readTelegramSession();

  if (session) return { accessToken: session.accessToken, role: session.role, isGuest: false };

  write(TELEGRAM_SESSION_KEY, null);

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

export const signInOnWebsite = ({ afterRejection = false } = {}) => oneAtATime(signIn(afterRejection));

// «Выйти»: forget the Telegram session and go back to a quiet guest. The guest
// was merged into the Telegram account at sign-in, so this is a new, empty one.
export const signOutOnWebsite = () => {
  write(TELEGRAM_SESSION_KEY, null);

  return oneAtATime(logInAsGuest);
};

// Who signed in with Telegram - the profile shows them like the Mini App's
// user. Null for a guest.
export const getWebsiteUser = (): TmaUserInfo | null => readTelegramSession()?.user ?? null;

// The backend's answer to a website guest buying or claiming a gift
// (../backend src/auth/require-telegram.ts): log in with Telegram first.
export const isTelegramRequired = (error: unknown) =>
  isAxiosError<{ error?: string }>(error) &&
  error.response?.status === 403 &&
  error.response.data?.error === "telegram_required";
