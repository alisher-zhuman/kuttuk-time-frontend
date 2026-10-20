import { Loader2 } from "lucide-react";

import { MerchantForm } from "@widgets/merchants/merchant-form";

import { useMerchantOptionsQuery } from "@entities/merchant";

import { ErrorState } from "@shared/ui";

export const MerchantCreatePage = () => {
  const { options, isLoading, isError, isFetching, retry } = useMerchantOptionsQuery();

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 size={28} color="var(--color-hint)" className="animate-spin" />
      </div>
    );
  }

  if (isError || !options) {
    return <ErrorState onRetry={retry} isRetrying={isFetching} />;
  }

  return <MerchantForm options={options} variant={{ kind: "create" }} />;
};
