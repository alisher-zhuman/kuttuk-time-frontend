import { useParams, useSearchParams } from "react-router";

import { MerchantNotFound } from "@widgets/merchants/merchant-detail";
import { MerchantForm } from "@widgets/merchants/merchant-form";

import { useAdminMerchantQuery } from "@entities/merchant";

import { ErrorState, PageLoader } from "@shared/ui";

export const MerchantEditPage = () => {
  const { id } = useParams<{ id: string }>();

  // ?focus=payoutDetails - opened by «Указать реквизиты» from payouts.
  const [searchParams] = useSearchParams();

  const { merchant, isLoading, isError, isNotFound, isFetching, retry } = useAdminMerchantQuery(id);

  if (isLoading) {
    return <PageLoader />;
  }

  if (isNotFound) return <MerchantNotFound />;
  if (isError || !merchant) return <ErrorState onRetry={retry} isRetrying={isFetching} />;

  return (
    <MerchantForm
      variant={{ kind: "edit", merchant }}
      focusPayoutDetails={searchParams.get("focus") === "payoutDetails"}
    />
  );
};
