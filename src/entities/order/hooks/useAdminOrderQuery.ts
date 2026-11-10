import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";

import { getAdminOrder } from "../api";
import { orderKeys } from "../model/keys";

export const useAdminOrderQuery = (id: string | undefined) => {
  const { data, error, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: orderKeys.adminDetail(id ?? ""),
    queryFn: () => getAdminOrder(id!),
    enabled: Boolean(id)
  });

  return {
    order: data,
    isLoading,
    isError,
    // Only a 404 is "no such order" - a network error or 5xx offers a retry.
    isNotFound: isAxiosError(error) && error.response?.status === 404,
    isFetching,
    retry: () => void refetch()
  };
};
