import { useTranslation } from "react-i18next";

import { ROUTES } from "@shared/constants";
import { useHaptic, useNavigateTo } from "@shared/hooks";

export const NotFoundPage = () => {
  const { t } = useTranslation();
  
  const navigateTo = useNavigateTo();

  const haptic = useHaptic();

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center gap-4 px-8 text-center">
      <span className="text-6xl font-bold text-(--color-primary)">
        {t("notFound.title")}
      </span>

      <p className="text-(--color-slate) text-base">
        {t("notFound.description")}
      </p>

      <button
        type="button"
        onClick={() => { haptic.light(); navigateTo(ROUTES.HOME); }}
        className="px-6 py-3 rounded-full bg-(--color-primary) text-(--color-card) font-semibold text-sm cursor-pointer"
      >
        {t("notFound.goHome")}
      </button>
    </div>
  );
};
