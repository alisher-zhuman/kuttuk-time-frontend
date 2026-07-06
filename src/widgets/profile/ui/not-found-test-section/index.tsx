import { useTranslation } from "react-i18next";

import { Bug } from "lucide-react";

import { useHaptic, useNavigateTo } from "@shared/hooks";

export const NotFoundTestSection = () => {
  const { t } = useTranslation();

  const navigateTo = useNavigateTo();

  const haptic = useHaptic();

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold text-(--color-slate) uppercase tracking-wider px-1">
        {t("debug.label")}
      </span>

      <button
        type="button"
        onClick={() => {
          haptic.light();
          navigateTo("/not-found-test");
        }}
        className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-(--color-card) border border-(--color-line) text-(--color-ink) text-sm font-semibold cursor-pointer"
      >
        <Bug size={18} />

        {t("debug.notFoundTest")}
      </button>
    </div>
  );
};
