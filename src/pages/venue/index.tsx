import { useParams } from "react-router";

import {
  VenueContent,
  VenueNotFound,
  VenueSkeleton
} from "@widgets/venue";

import { useMerchantQuery } from "@entities/merchant";

export const VenuePage = () => {
  const { handle } = useParams<{ handle: string }>();

  const { merchant, isLoading, isError } = useMerchantQuery(handle);

  if (isLoading) return <VenueSkeleton />;
  if (isError || !merchant) return <VenueNotFound />;

  return <VenueContent merchant={merchant} />;
};
