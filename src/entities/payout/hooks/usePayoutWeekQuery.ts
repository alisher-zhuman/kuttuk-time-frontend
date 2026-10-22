import { useQuery } from "@tanstack/react-query";

import { getPayoutWeek } from "../api";
import { payoutKeys } from "../model/keys";

export const usePayoutWeekQuery = (week: string | null) => {
  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: payoutKeys.week(week),
    queryFn: () => getPayoutWeek(week)
  });

  return { report: data, isLoading, isError, isFetching, retry: () => void refetch() };
};
