import { keepPreviousData, QueryClient } from "@tanstack/react-query";

export const QUERY_CLIENT = new QueryClient({
  defaultOptions: {
    queries: {
      placeholderData: keepPreviousData,
      staleTime: 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
