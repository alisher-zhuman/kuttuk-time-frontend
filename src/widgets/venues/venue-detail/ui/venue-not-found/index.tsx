import { useTranslation } from "react-i18next";

import { Store } from "lucide-react";

import { EmptyState } from "@shared/ui";

export const VenueNotFound = () => {
  const { t } = useTranslation();

  return (
    <EmptyState
      variant="page"
      icon={<Store size={32} strokeWidth={1.5} />}
      message={t("admin.venues.detail.notFound")}
    />
  );
};
