import { useTranslation } from "react-i18next";

import { Bell, BellRing } from "lucide-react";

import { useBotMessages } from "@shared/hooks";

// Merchant only: the bot can send "new sale" only after the owner allowed it -
// started the bot, or granted it here. A refusal keeps the button.
export const NotificationsSection = () => {
  const { t } = useTranslation();

  const { isAllowed: isEnabled, isRequesting, allow } = useBotMessages();

  const Icon = isEnabled ? BellRing : Bell;

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold text-(--color-slate) uppercase tracking-wider px-1">
        {t("merchant.notifications.title")}
      </span>

      <div className="flex items-center gap-3 p-3 rounded-2xl bg-(--color-card) border border-(--color-line)">
        <Icon size={20} className="text-(--color-primary) shrink-0" />

        <span className="flex-1 min-w-0 text-sm text-(--color-ink)">
          {t("merchant.notifications.hint")}
        </span>

        {isEnabled ? (
          <span className="shrink-0 text-sm font-bold text-(--color-green)">
            {t("merchant.notifications.enabled")}
          </span>
        ) : (
          <button
            type="button"
            disabled={isRequesting}
            onClick={() => void allow()}
            className="shrink-0 px-3.5 py-2 rounded-full bg-(--color-primary) text-(--color-card) text-sm font-bold cursor-pointer disabled:opacity-60"
          >
            {t("merchant.notifications.enable")}
          </button>
        )}
      </div>
    </div>
  );
};
