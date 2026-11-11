import { resolveLang } from "@shared/helpers";

// Telegram's «Log In With Telegram» library
// (https://core.telegram.org/bots/telegram-login): a popup on oauth.telegram.org
// answers with an id_token (a JWT the backend checks) or an error.
export const TELEGRAM_LOGIN_SCRIPT = "https://oauth.telegram.org/js/telegram-login.js?6";

export interface TelegramLoginResult {
  id_token?: string;
  // The id_token's decoded claims.
  user?: Record<string, unknown>;
  // "popup_closed" - the person closed the window; anything else - a failure.
  error?: string;
}

interface TelegramLoginOptions {
  client_id: number;
  scope: string[];
  lang: string;
}

interface TelegramLoginApi {
  auth: (options: TelegramLoginOptions, callback: (result: TelegramLoginResult) => void) => void;
}

// Not a global declaration: test-utils types window.Telegram for the Mini App
// bridge.
export const getTelegramLogin = () =>
  (window as unknown as { Telegram?: { Login?: TelegramLoginApi } }).Telegram?.Login;

let loading: Promise<void> | null = null;

// Loaded once, ahead of the tap: the library opens its popup right from the
// tap - a popup opened later (after a load) is blocked by the browser.
export const loadTelegramLogin = (): Promise<void> => {
  if (getTelegramLogin()) return Promise.resolve();

  loading ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = TELEGRAM_LOGIN_SCRIPT;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      loading = null;
      script.remove();
      reject(new Error("telegram-login.js failed to load"));
    };
    document.head.appendChild(script);
  });

  return loading;
};

// Telegram's language codes: Kyrgyz is "ky" (ours is "kg").
export const toTelegramLang = (language: string) => {
  const lang = resolveLang(language);

  return lang === "kg" ? "ky" : lang;
};
