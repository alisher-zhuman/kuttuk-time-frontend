import { useParams } from "react-router";

import {
  VenueContent,
  VenueNotFound,
  VenueSkeleton
} from "@widgets/venue";

import { useVenueQuery } from "@entities/venue";

export const VenuePage = () => {
  const { handle } = useParams<{ handle: string }>();

  const { venue, isLoading, isError } = useVenueQuery(handle);

  if (isLoading) return <VenueSkeleton />;
  if (isError || !venue) return <VenueNotFound />;

  return <VenueContent venue={venue} />;
};
