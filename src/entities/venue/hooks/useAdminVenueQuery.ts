import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";

import { getAdminVenue } from "../api";
import { venueKeys } from "../model/keys";

export const useAdminVenueQuery = (id: string | undefined) => {
  const { data, error, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: venueKeys.adminDetail(id ?? ""),
    queryFn: () => getAdminVenue(id!),
    enabled: Boolean(id)
  });

  return {
    venue: data,
    isLoading,
    isError,
    // Only a 404 is "no such venue" - a network error or 5xx offers a retry.
    isNotFound: isAxiosError(error) && error.response?.status === 404,
    isFetching,
    retry: () => void refetch()
  };
};
