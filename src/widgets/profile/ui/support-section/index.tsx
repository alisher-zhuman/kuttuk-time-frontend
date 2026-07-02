import { useTranslation } from "react-i18next";

import { openTelegramLink } from "@tma.js/sdk-react";
import { MessageCircle } from "lucide-react";

import { SUPPORT_URL } from "@shared/constants";
import { useHaptic } from "@shared/hooks";

export const SupportSection = () => {
  const { t } = useTranslation();

  const haptic = useHaptic();

  const handleClick = () => {
    haptic.light();

    if (openTelegramLink.isAvailable()) {
      openTelegramLink(SUPPORT_URL);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold text-(--color-slate) uppercase tracking-wider px-1">
        {t("support.label")}
      </span>

      <button
        type="button"
        onClick={handleClick}
        className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-(--color-card) border border-(--color-line) text-(--color-ink) text-sm font-semibold cursor-pointer"
      >
        <MessageCircle size={18} />

        {t("support.contact")}
      </button>
    </div>
  );
};
