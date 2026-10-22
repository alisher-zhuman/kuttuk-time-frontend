import { useTranslation } from "react-i18next";

import { CircleOff } from "lucide-react";

import { useOpenSupport } from "@shared/hooks";

export const MerchantDeactivatedNotice = () => {
  const { t } = useTranslation();

  const { open: openSupport } = useOpenSupport();

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
        onClick={openSupport}
        className="self-start px-4 py-2.5 rounded-full bg-(--color-accent) text-(--color-card) text-sm font-semibold cursor-pointer"
      >
        {t("support.contact")}
      </button>
    </div>
  );
};
