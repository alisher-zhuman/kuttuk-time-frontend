import { useTranslation } from "react-i18next";

import { useQuery } from "@tanstack/react-query";

import { getVenues } from "../api";
import { venueKeys } from "../model/keys";

interface Params {
  search: string;
  category: number | null;
}

export const useVenuesQuery = ({ search, category }: Params) => {
  const { i18n } = useTranslation();

  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: venueKeys.list(search, category, i18n.language),
    queryFn: () => getVenues({ search, category })
  });

  return { venues: data ?? [], isLoading, isError, isFetching, retry: () => void refetch() };
};
