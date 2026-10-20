import { useQuery } from "@tanstack/react-query";

import { getMerchantSummary } from "../api";
import { merchantKeys } from "../model/keys";

export const useMerchantSummaryQuery = (week: string | null) => {
  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: merchantKeys.summary(week),
    queryFn: () => getMerchantSummary(week),
    // The header dates come from the data — never show last week's numbers
    // under a skeleton of the new one.
    placeholderData: () => undefined
  });

  return { summary: data, isLoading, isError, isFetching, retry: () => void refetch() };
};
