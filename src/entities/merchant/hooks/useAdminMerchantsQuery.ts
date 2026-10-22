import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getAdminMerchants } from "../api";
import { merchantKeys } from "../model/keys";

export const useAdminMerchantsQuery = ({
  search,
  isActive
}: {
  search: string;
  isActive: boolean | null;
}) => {
  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: merchantKeys.adminList(search, isActive),
    // Search / filters keep the current rows until the new ones land.
    placeholderData: keepPreviousData,
    queryFn: () => getAdminMerchants({ search, isActive })
  });

  return { merchants: data ?? [], isLoading, isError, isFetching, retry: () => void refetch() };
};
