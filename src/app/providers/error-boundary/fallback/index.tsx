import { useTranslation } from "react-i18next";

import { PillButton } from "@shared/ui";

interface Props {
  onReload: () => void;
}

export const Fallback = ({ onReload }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center gap-4 bg-(--color-bg) px-8 text-center">
      <span className="text-xl font-extrabold tracking-tight text-(--color-ink)">
        {t("errors.genericTitle")}
      </span>

      <p className="text-(--color-slate) text-base">{t("errors.generic")}</p>

      <PillButton onClick={onReload}>{t("errors.reload")}</PillButton>
    </div>
  );
};
