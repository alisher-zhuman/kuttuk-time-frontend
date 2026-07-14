import { useTranslation } from "react-i18next";

import { Store } from "lucide-react";

import { EmptyState } from "@shared/ui";

export const MerchantHomePage = () => {
  const { t } = useTranslation();

  return (
    <div className="flex-1 flex flex-col gap-4 mt-3.5">
      <h1 className="text-xl font-extrabold tracking-tight text-(--color-ink) leading-tight">
        {t("merchant.home.title")}
      </h1>

      <EmptyState
        variant="page"
        icon={<Store size={32} strokeWidth={1.5} />}
        message={t("merchant.home.comingSoon")}
      />
    </div>
  );
};
