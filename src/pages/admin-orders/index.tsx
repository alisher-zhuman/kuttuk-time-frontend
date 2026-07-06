import { useTranslation } from "react-i18next";

export const AdminOrdersPage = () => {
  const { t } = useTranslation();

  return (
    <div className="flex-1 flex items-center justify-center">
      <span className="text-(--color-hint) text-sm font-semibold">
        {t("admin.nav.orders")}
      </span>
    </div>
  );
};
