import { useState } from "react";

import { useTranslation } from "react-i18next";

import { Bell, BellRing } from "lucide-react";

import { hasWriteAccess, requestBotMessages } from "@shared/helpers";
import { useHaptic } from "@shared/hooks";

// The bot can message the owner ("new sale") only after the owner allowed it —
// started the bot, or granted it here. A refusal keeps the button.
export const SaleNotifications = () => {
  const [isEnabled, setIsEnabled] = useState(hasWriteAccess);
  const [isRequesting, setIsRequesting] = useState(false);

  const { t } = useTranslation();

  const haptic = useHaptic();

  const handleEnable = async () => {
    haptic.light();
    setIsRequesting(true);

    const granted = await requestBotMessages();

    setIsRequesting(false);
    setIsEnabled(granted);

    if (granted) haptic.success();
  };

  const Icon = isEnabled ? BellRing : Bell;

  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl bg-(--color-card) border border-(--color-line)">
      <Icon size={20} className="text-(--color-primary) shrink-0" />

      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <span className="text-sm font-bold text-(--color-ink)">
          {t("merchant.notifications.title")}
        </span>
        <span className="text-xs text-(--color-hint)">{t("merchant.notifications.hint")}</span>
      </div>

      {isEnabled ? (
        <span className="shrink-0 text-sm font-bold text-(--color-green)">
          {t("merchant.notifications.enabled")}
        </span>
      ) : (
        <button
          type="button"
          disabled={isRequesting}
          onClick={() => void handleEnable()}
          className="shrink-0 px-3.5 py-2 rounded-full bg-(--color-primary) text-(--color-card) text-sm font-bold cursor-pointer disabled:opacity-60"
        >
          {t("merchant.notifications.enable")}
        </button>
      )}
    </div>
  );
};
