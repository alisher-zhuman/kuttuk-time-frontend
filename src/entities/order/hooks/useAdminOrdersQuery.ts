import { useInfiniteQuery } from "@tanstack/react-query";

import { getAdminOrders } from "../api";
import { type AdminOrderFilters, orderKeys } from "../model/keys";

export const useAdminOrdersQuery = (filters: AdminOrderFilters) => {
  const { data, error, isLoading, isError, isFetching, isFetchingNextPage, isFetchNextPageError, hasNextPage, fetchNextPage, refetch } =
    useInfiniteQuery({
      queryKey: orderKeys.adminList(filters),
      queryFn: ({ pageParam, signal }) => getAdminOrders({ ...filters, cursor: pageParam }, signal),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => lastPage.nextCursor
    });

  return {
    orders: data?.pages.flatMap((page) => page.items) ?? [],
    error,
    isLoading,
    // Only when there's nothing to show: a failed next page keeps the rows and
    // offers its own retry (isLoadMoreError).
    isError: isError && data === undefined,
    isLoadMoreError: isFetchNextPageError,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage: () => void fetchNextPage(),
    retry: () => void refetch()
  };
};
