import { useQuery } from "@tanstack/react-query";

import { getMerchantMe } from "../api";
import { merchantKeys } from "../model/keys";

export const useMerchantMeQuery = () => {
  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: merchantKeys.me(),
    queryFn: getMerchantMe
  });

  return { merchant: data, isLoading, isError, isFetching, retry: () => void refetch() };
};
