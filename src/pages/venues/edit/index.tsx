import { useParams } from "react-router";

import { VenueNotFound } from "@widgets/venues/venue-detail";
import { VenueForm } from "@widgets/venues/venue-form";

import { useAdminVenueQuery, useVenueOptionsQuery } from "@entities/venue";

import { ErrorState, PageLoader } from "@shared/ui";

export const VenueEditPage = () => {
  const { id } = useParams<{ id: string }>();

  const { venue, isLoading, isError } = useAdminVenueQuery(id);

  const optionsQuery = useVenueOptionsQuery();

  if (isLoading || optionsQuery.isLoading) {
    return <PageLoader />;
  }

  if (isError || !venue) return <VenueNotFound />;

  if (optionsQuery.isError || !optionsQuery.options) {
    return <ErrorState onRetry={optionsQuery.retry} isRetrying={optionsQuery.isFetching} />;
  }

  return <VenueForm options={optionsQuery.options} variant={{ kind: "edit", venue }} />;
};
