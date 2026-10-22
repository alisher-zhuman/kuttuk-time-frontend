import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getAdminVenues } from "../api";
import { venueKeys } from "../model/keys";

interface Params {
  search: string;
  category: number | null;
  isActive: boolean | null;
  merchantId: number | null;
}

export const useAdminVenuesQuery = ({ search, category, isActive, merchantId }: Params) => {
  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: venueKeys.adminList(search, category, isActive, merchantId),
    // Search / filters keep the current rows until the new ones land.
    placeholderData: keepPreviousData,
    queryFn: () => getAdminVenues({ search, category, isActive, merchantId })
  });

  return { venues: data ?? [], isLoading, isError, isFetching, retry: () => void refetch() };
};
