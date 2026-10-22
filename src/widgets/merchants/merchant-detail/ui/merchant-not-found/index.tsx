import { useTranslation } from "react-i18next";

import { UserRound } from "lucide-react";

import { EmptyState } from "@shared/ui";

export const MerchantNotFound = () => {
  const { t } = useTranslation();

  return (
    <EmptyState
      variant="page"
      icon={<UserRound size={32} strokeWidth={1.5} />}
      message={t("admin.merchants.detail.notFound")}
    />
  );
};
