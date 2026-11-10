import { useParams } from "react-router";

import {
  VenueContent,
  VenueNotFound,
  VenueSkeleton
} from "@widgets/venue";

import { useVenueQuery } from "@entities/venue";

import { ErrorState } from "@shared/ui";

export const VenuePage = () => {
  const { handle } = useParams<{ handle: string }>();

  const { venue, isLoading, isError, isNotFound, isFetching, retry } = useVenueQuery(handle);

  if (isLoading) return <VenueSkeleton />;
  // Before the data check: a refetch after a failed «Купить» can find the
  // venue gone (404) while the old data is still cached.
  if (isNotFound) return <VenueNotFound />;
  if (isError && !venue) return <ErrorState onRetry={retry} isRetrying={isFetching} />;
  if (!venue) return <VenueNotFound />;

  return <VenueContent venue={venue} />;
};
