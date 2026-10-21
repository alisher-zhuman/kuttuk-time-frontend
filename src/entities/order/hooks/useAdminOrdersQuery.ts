import { useInfiniteQuery } from "@tanstack/react-query";

import { getAdminOrders } from "../api";
import { orderKeys } from "../model/keys";
import type { OrderStatus } from "../model/types";

export const useAdminOrdersQuery = (status: OrderStatus | null, search: string) => {
  const { data, error, isLoading, isError, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage, refetch } =
    useInfiniteQuery({
      queryKey: orderKeys.adminList(status, search),
      queryFn: ({ pageParam, signal }) =>
        getAdminOrders({ status, search, cursor: pageParam }, signal),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      // Switching the status / search must not show the previous filter's rows.
      placeholderData: () => undefined
    });

  return {
    orders: data?.pages.flatMap((page) => page.items) ?? [],
    error,
    isLoading,
    isError,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage: () => void fetchNextPage(),
    retry: () => void refetch()
  };
};
