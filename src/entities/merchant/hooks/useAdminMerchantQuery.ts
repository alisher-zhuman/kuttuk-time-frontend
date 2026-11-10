import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";

import { getAdminMerchant } from "../api";
import { merchantKeys } from "../model/keys";

export const useAdminMerchantQuery = (id: string | undefined) => {
  const { data, error, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: merchantKeys.adminDetail(id ?? ""),
    queryFn: () => getAdminMerchant(id!),
    enabled: Boolean(id)
  });

  return {
    merchant: data,
    isLoading,
    isError,
    // Only a 404 is "no such merchant" - a network error or 5xx offers a retry.
    isNotFound: isAxiosError(error) && error.response?.status === 404,
    isFetching,
    retry: () => void refetch()
  };
};
