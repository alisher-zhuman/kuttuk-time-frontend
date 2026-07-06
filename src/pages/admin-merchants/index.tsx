import { useTranslation } from "react-i18next";

export const AdminMerchantsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="flex-1 flex items-center justify-center">
      <span className="text-(--color-hint) text-sm font-semibold">
        {t("admin.nav.merchants")}
      </span>
    </div>
  );
};
