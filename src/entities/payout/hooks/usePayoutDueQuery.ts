import { useQuery } from "@tanstack/react-query";

import { getPayoutDue } from "../api";
import { payoutKeys } from "../model/keys";

export const usePayoutDueQuery = () => {
  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: payoutKeys.due(),
    queryFn: getPayoutDue
  });

  return { due: data, isLoading, isError, isFetching, retry: () => void refetch() };
};
