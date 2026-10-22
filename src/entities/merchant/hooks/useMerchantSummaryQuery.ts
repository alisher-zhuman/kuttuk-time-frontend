import { useQuery } from "@tanstack/react-query";

import { getMerchantSummary } from "../api";
import { merchantKeys } from "../model/keys";

export const useMerchantSummaryQuery = (week: string | null, venueId: number | null) => {
  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: merchantKeys.summary(week, venueId),
    queryFn: () => getMerchantSummary(week, venueId)
  });

  return { summary: data, isLoading, isError, isFetching, retry: () => void refetch() };
};
