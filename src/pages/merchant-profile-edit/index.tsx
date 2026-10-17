import { useTranslation } from "react-i18next";

import { Loader2, Store } from "lucide-react";

import { MerchantProfileForm } from "@features/merchant-profile-form";

import {
  MerchantDeactivatedNotice,
  useMerchantMeQuery,
  useMerchantOptionsQuery
} from "@entities/merchant";

import { EmptyState, ErrorState } from "@shared/ui";

export const MerchantProfileEditPage = () => {
  const { t } = useTranslation();

  const { merchant, isLoading, isError } = useMerchantMeQuery();

  const optionsQuery = useMerchantOptionsQuery();

  if (isLoading || optionsQuery.isLoading) {
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

  // Also reached when a save gets 403 mid-edit: the mutation refetches "me",
  // and the fresh isActive: false swaps the form for this notice.
  if (!merchant.isActive) {
    return (
      <div className="mt-3.5">
        <MerchantDeactivatedNotice />
      </div>
    );
  }

  if (optionsQuery.isError || !optionsQuery.options) {
    return <ErrorState onRetry={optionsQuery.retry} isRetrying={optionsQuery.isFetching} />;
  }

  return <MerchantProfileForm merchant={merchant} options={optionsQuery.options} />;
};
