import { useSearchParams } from "react-router";

import { VenueForm } from "@widgets/venues/venue-form";

import { useVenueOptionsQuery } from "@entities/venue";

import { ErrorState, PageLoader } from "@shared/ui";

export const VenueCreatePage = () => {
  const [searchParams] = useSearchParams();

  const { options, isLoading, isError, isFetching, retry } = useVenueOptionsQuery();

  // Set when the admin adds a venue from a merchant's page.
  const merchantParam = Number(searchParams.get("merchantId"));
  const merchantId = Number.isInteger(merchantParam) && merchantParam > 0 ? merchantParam : null;

  if (isLoading) {
    return <PageLoader />;
  }

  if (isError || !options) {
    return <ErrorState onRetry={retry} isRetrying={isFetching} />;
  }

  return <VenueForm options={options} variant={{ kind: "create", merchantId }} />;
};
