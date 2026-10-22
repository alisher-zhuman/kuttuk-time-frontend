import { useTranslation } from "react-i18next";

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="flex justify-center py-3">
      <span className="text-xs text-(--color-hint)">{t("footer.madeWithLove")}</span>
    </footer>
  );
};
