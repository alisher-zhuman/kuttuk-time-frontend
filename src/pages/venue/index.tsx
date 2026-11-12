import { useLayoutEffect } from "react";
import { useParams } from "react-router";

import {
  VenueContent,
  VenueNotFound,
  VenueSkeleton
} from "@widgets/venue";

import { useVenueQuery } from "@entities/venue";

import { getVenueRoute } from "@shared/constants";
import { useNavigateTo } from "@shared/hooks";
import { useAppModeStore } from "@shared/store";
import { ErrorState } from "@shared/ui";

export const VenuePage = () => {
  const { handle } = useParams<{ handle: string }>();

  const navigateTo = useNavigateTo();

  const isWeb = useAppModeStore((s) => s.mode === "web");

  const { venue, isLoading, isError, isNotFound, isFetching, retry } = useVenueQuery(handle);

  // The website: one address per venue, by its slug - what search engines
  // index. An old link by id (or a slug renamed since) moves to it.
  const slug = venue?.slug;

  useLayoutEffect(() => {
    if (isWeb && slug && handle !== slug) navigateTo(getVenueRoute(slug), { replace: true });
  }, [isWeb, slug, handle, navigateTo]);

  if (isLoading) return <VenueSkeleton />;
  // Before the data check: a refetch after a failed «Купить» can find the
  // venue gone (404) while the old data is still cached.
  if (isNotFound) return <VenueNotFound />;
  if (isError && !venue) return <ErrorState onRetry={retry} isRetrying={isFetching} />;
  if (!venue) return <VenueNotFound />;

  return <VenueContent venue={venue} />;
};
