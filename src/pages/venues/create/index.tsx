import { useSearchParams } from "react-router";

import { Loader2 } from "lucide-react";

import { VenueForm } from "@widgets/venues/venue-form";

import { useVenueOptionsQuery } from "@entities/venue";

import { ErrorState } from "@shared/ui";

export const VenueCreatePage = () => {
  const [searchParams] = useSearchParams();

  const { options, isLoading, isError, isFetching, retry } = useVenueOptionsQuery();

  // Set when the admin adds a venue from a merchant's page.
  const merchantParam = Number(searchParams.get("merchantId"));
  const merchantId = Number.isInteger(merchantParam) && merchantParam > 0 ? merchantParam : null;

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

  return <VenueForm options={options} variant={{ kind: "create", merchantId }} />;
};
