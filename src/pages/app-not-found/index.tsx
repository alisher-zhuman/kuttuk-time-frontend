import { BOT_URL } from "@shared/constants";
import { Logo } from "@shared/ui";

export const AppNotFoundPage = () => (
  <div className="min-h-dvh flex flex-col items-center justify-center gap-6 bg-white px-8 text-center">
    <div className="flex flex-col items-center gap-1">
      <Logo />
      <span className="text-sm text-gray-400">Mini App</span>
    </div>

    <p className="text-gray-600 text-base leading-relaxed max-w-xs">
      Это Telegram Mini App. Открой его через бота в Telegram.
    </p>

    <a
      href={BOT_URL}
      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-500 text-white font-semibold text-sm"
    >
      Открыть в Telegram
    </a>
  </div>
);
