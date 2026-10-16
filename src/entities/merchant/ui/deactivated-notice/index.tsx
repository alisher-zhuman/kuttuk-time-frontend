import { useTranslation } from "react-i18next";

import { openTelegramLink } from "@tma.js/sdk-react";
import { CircleOff } from "lucide-react";

import { SUPPORT_URL } from "@shared/constants";
import { useHaptic } from "@shared/hooks";

export const MerchantDeactivatedNotice = () => {
  const { t } = useTranslation();

  const haptic = useHaptic();

  const handleContact = () => {
    haptic.light();

    if (openTelegramLink.isAvailable()) {
      openTelegramLink(SUPPORT_URL);
    }
  };

  return (
    <div className="flex flex-col gap-3 p-4 rounded-2xl bg-(--color-accent-tint)">
      <div className="flex items-center gap-2.5 text-(--color-accent)">
        <CircleOff size={20} className="shrink-0" />

        <span className="text-base font-extrabold">
          {t("merchant.deactivated.title")}
        </span>
      </div>

      <p className="text-sm text-(--color-ink)">{t("merchant.deactivated.message")}</p>

      <button
        type="button"
        onClick={handleContact}
        className="self-start px-4 py-2.5 rounded-full bg-(--color-accent) text-(--color-card) text-sm font-semibold cursor-pointer"
      >
        {t("support.contact")}
      </button>
    </div>
  );
};
