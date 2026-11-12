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
    // One line: what's off and the switch - the explanation lives in settings.
    <div className="flex items-center gap-3 pl-3 pr-3 py-1 rounded-2xl bg-(--color-primary-tint)">
      <BellRing size={18} className="text-(--color-primary) shrink-0" />

      <span className="flex-1 min-w-0 text-sm font-semibold text-(--color-ink)">
        {t("merchant.notifications.bannerTitle")}
      </span>

      <button
        type="button"
        disabled={isRequesting}
        onClick={() => void allow()}
        className="shrink-0 min-h-11 px-2 -mr-2 text-sm font-bold text-(--color-primary) cursor-pointer disabled:opacity-60"
      >
        {t("merchant.notifications.enable")}
      </button>
    </div>
  );
};
