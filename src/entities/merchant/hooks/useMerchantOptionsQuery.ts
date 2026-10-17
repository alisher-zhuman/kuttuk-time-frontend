import { useQuery } from "@tanstack/react-query";

import { getMerchantOptions } from "../api";
import { merchantKeys } from "../model/keys";

export const useMerchantOptionsQuery = () => {
  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: merchantKeys.options(),
    queryFn: getMerchantOptions,
    // Backend constants — they only change with a deploy, so once per session.
    staleTime: Infinity
  });

  return { options: data, isLoading, isError, isFetching, retry: () => void refetch() };
};
