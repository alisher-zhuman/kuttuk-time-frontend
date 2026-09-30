import { useTranslation } from "react-i18next";

import { Loader2, Store } from "lucide-react";

import { MerchantProfileForm } from "@features/merchant-profile-form";

import { useMerchantMeQuery } from "@entities/merchant";

import { EmptyState } from "@shared/ui";

export const MerchantProfileEditPage = () => {
  const { t } = useTranslation();

  const { merchant, isLoading, isError } = useMerchantMeQuery();

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 size={28} color="var(--color-hint)" className="animate-spin" />
      </div>
    );
  }

  if (isError || !merchant) {
    return (
      <EmptyState
        variant="page"
        icon={<Store size={32} strokeWidth={1.5} />}
        message={t("merchant.home.loadError")}
      />
    );
  }

  return <MerchantProfileForm merchant={merchant} />;
};
