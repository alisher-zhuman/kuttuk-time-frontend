import { useTranslation } from "react-i18next";

import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";

import { getVenue } from "../api";
import { venueKeys } from "../model/keys";

export const useVenueQuery = (idOrSlug: string | undefined) => {
  const { i18n } = useTranslation();

  const { data, error, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: venueKeys.detail(idOrSlug ?? "", i18n.language),
    queryFn: () => getVenue(idOrSlug!),
    enabled: Boolean(idOrSlug)
  });

  return {
    venue: data,
    isLoading,
    isError,
    // Only a 404 means "no such venue"; a network error or 5xx (a cold backend)
    // must not tell a buyer from a deep link that the venue doesn't exist.
    isNotFound: isAxiosError(error) && error.response?.status === 404,
    isFetching,
    retry: () => void refetch()
  };
};
