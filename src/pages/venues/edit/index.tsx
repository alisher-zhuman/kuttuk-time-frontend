import { useParams } from "react-router";

import { VenueNotFound } from "@widgets/venues/venue-detail";
import { VenueForm } from "@widgets/venues/venue-form";

import { useAdminVenueQuery, useVenueOptionsQuery } from "@entities/venue";

import { ErrorState, PageLoader } from "@shared/ui";

export const VenueEditPage = () => {
  const { id } = useParams<{ id: string }>();

  const { venue, isLoading, isError, isNotFound, isFetching, retry } = useAdminVenueQuery(id);

  const optionsQuery = useVenueOptionsQuery();

  if (isLoading || optionsQuery.isLoading) {
    return <PageLoader />;
  }

  if (isNotFound) return <VenueNotFound />;
  if (isError || !venue) return <ErrorState onRetry={retry} isRetrying={isFetching} />;

  if (optionsQuery.isError || !optionsQuery.options) {
    return <ErrorState onRetry={optionsQuery.retry} isRetrying={optionsQuery.isFetching} />;
  }

  return <VenueForm options={optionsQuery.options} variant={{ kind: "edit", venue }} />;
};
