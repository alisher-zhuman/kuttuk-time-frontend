import { useTranslation } from "react-i18next";

import { BellRing } from "lucide-react";

import { useBotMessages } from "@shared/hooks";

// In the cabinet until the owner lets the bot message them: without it they
// never hear about a sale. The same switch is in profile settings; this one is
// where the owner actually looks.
export const SaleNotificationsBanner = () => {
  const { t } = useTranslation();

  const { isAllowed, isRequesting, allow } = useBotMessages();

  if (isAllowed) return null;

  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl bg-(--color-primary-tint) border border-(--color-line)">
      <BellRing size={20} className="text-(--color-primary) shrink-0" />

      <span className="flex-1 min-w-0 flex flex-col gap-0.5">
        <span className="text-sm font-bold text-(--color-ink)">{t("merchant.notifications.bannerTitle")}</span>
        <span className="text-xs text-(--color-slate)">{t("merchant.notifications.hint")}</span>
      </span>

      <button
        type="button"
        disabled={isRequesting}
        onClick={() => void allow()}
        className="shrink-0 px-3.5 py-2 rounded-full bg-(--color-primary) text-(--color-card) text-sm font-bold cursor-pointer disabled:opacity-60"
      >
        {t("merchant.notifications.enable")}
      </button>
    </div>
  );
};
