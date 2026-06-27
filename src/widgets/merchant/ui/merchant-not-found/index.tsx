import { useNavigate } from "react-router";

import { useTranslation } from "react-i18next";

import { Store } from "lucide-react";

import { useHaptic } from "@shared/hooks";

export const MerchantNotFound = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const haptic = useHaptic();

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-(--color-hint)">
      <span className="size-16 rounded-2xl bg-(--color-chip) flex items-center justify-center">
        <Store size={32} strokeWidth={1.5} />
      </span>

      <p className="text-sm font-semibold">{t("merchantDetail.notFound")}</p>

      <button
        type="button"
        onClick={() => {
          haptic.light();
          void navigate(-1);
        }}
        className="px-6 py-3 rounded-full bg-(--color-primary) text-(--color-card) font-semibold text-sm cursor-pointer"
      >
        {t("notFound.goBack")}
      </button>
    </div>
  );
};
