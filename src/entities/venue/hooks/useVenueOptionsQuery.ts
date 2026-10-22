import { useQuery } from "@tanstack/react-query";

import { getVenueOptions } from "../api";
import { venueKeys } from "../model/keys";

export const useVenueOptionsQuery = () => {
  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: venueKeys.options(),
    queryFn: getVenueOptions,
    // Backend constants — they only change with a deploy, so once per session.
    staleTime: Infinity
  });

  return { options: data, isLoading, isError, isFetching, retry: () => void refetch() };
};
