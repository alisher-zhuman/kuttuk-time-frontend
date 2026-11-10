import { useQuery } from "@tanstack/react-query";

import { getPayoutWeek } from "../api";
import { payoutKeys } from "../model/keys";

// week: null = the current week; undefined = not known yet (waits).
export const usePayoutWeekQuery = (week: string | null | undefined) => {
  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: payoutKeys.week(week ?? null),
    queryFn: () => getPayoutWeek(week ?? null),
    enabled: week !== undefined
  });

  return {
    report: data,
    // Waiting for the week counts as loading - the screen shows its skeleton.
    isLoading: isLoading || week === undefined,
    isError,
    isFetching,
    retry: () => void refetch()
  };
};
