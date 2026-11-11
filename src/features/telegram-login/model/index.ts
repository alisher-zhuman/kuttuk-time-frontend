import { isWebsite, useAuthStore } from "@shared/store";

export {
  getTelegramLogin,
  loadTelegramLogin,
  TELEGRAM_LOGIN_SCRIPT,
  type TelegramLoginResult,
  toTelegramLang
} from "./telegram-login";

// The website's guest may only browse: buying and claiming a gift need
// «Войти через Telegram» first (../backend src/auth/require-telegram.ts).
export const needsTelegramLogin = () => isWebsite() && useAuthStore.getState().isGuest;
