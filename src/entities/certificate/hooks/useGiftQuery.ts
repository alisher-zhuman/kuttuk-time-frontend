import { useQuery } from "@tanstack/react-query";

import { getGift } from "../api";
import { isGiftNotFound } from "../model/gift-errors";
import { certificateKeys } from "../model/keys";

export const useGiftQuery = (token: string) => {
  const { data, error, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: certificateKeys.gift(token),
    queryFn: () => getGift(token)
  });

  return {
    gift: data,
    isLoading,
    isNotFound: isGiftNotFound(error),
    isError,
    isFetching,
    retry: () => void refetch()
  };
};
