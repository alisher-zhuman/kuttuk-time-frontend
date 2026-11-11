import { useEffect, useRef } from "react";

import { type TelegramAuthData } from "@shared/api";
import { BOT_USERNAME } from "@shared/constants";

interface Props {
  onAuth: (authData: TelegramAuthData) => void;
}

declare global {
  interface Window {
    onKuttukTelegramAuth?: (user: TelegramAuthData) => void;
  }
}

// Telegram's official Login Widget (telegram-widget.js draws its button in an
// iframe). request-access=write: the bot may message the buyer afterwards -
// receipts, expiry reminders. Needs the site's domain in BotFather /setdomain.
export const TelegramLoginWidget = ({ onAuth }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const onAuthRef = useRef(onAuth);

  useEffect(() => {
    onAuthRef.current = onAuth;
  }, [onAuth]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    // One global for Telegram's script: the widget mounted last owns it.
    const handleAuth = (user: TelegramAuthData) => onAuthRef.current(user);
    window.onKuttukTelegramAuth = handleAuth;

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", BOT_USERNAME);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-radius", "12");
    script.setAttribute("data-request-access", "write");
    script.setAttribute("data-onauth", "onKuttukTelegramAuth(user)");

    container.appendChild(script);

    return () => {
      container.replaceChildren();
      if (window.onKuttukTelegramAuth === handleAuth) delete window.onKuttukTelegramAuth;
    };
  }, []);

  return <div ref={containerRef} className="min-h-10" />;
};
