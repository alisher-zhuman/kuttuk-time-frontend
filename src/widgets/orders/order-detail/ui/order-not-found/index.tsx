import { useTranslation } from "react-i18next";

import { ClipboardList } from "lucide-react";

import { EmptyState } from "@shared/ui";

export const OrderNotFound = () => {
  const { t } = useTranslation();

  return (
    <EmptyState
      variant="page"
      icon={<ClipboardList size={32} strokeWidth={1.5} />}
      message={t("admin.orders.notFound")}
    />
  );
};
