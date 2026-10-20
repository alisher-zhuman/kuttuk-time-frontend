import { useInfiniteQuery } from "@tanstack/react-query";

import { getMerchantCertificates } from "../api";
import { certificateKeys } from "../model/keys";
import type { CertificateStatus } from "../model/types";

// The merchant's own certificates across its venues (venueId narrows to one),
// one tab per status (null = all).
export const useMerchantCertificatesQuery = (
  status: CertificateStatus | null,
  venueId: number | null
) => {
  const { data, isLoading, isError, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage, refetch } =
    useInfiniteQuery({
      queryKey: certificateKeys.merchantList(status, venueId),
      queryFn: ({ pageParam, signal }) =>
        getMerchantCertificates(status, venueId, pageParam, signal),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      // Switching tabs must not show the previous tab's rows while loading.
      placeholderData: () => undefined
    });

  return {
    certificates: data?.pages.flatMap((page) => page.items) ?? [],
    isLoading,
    isError,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage: () => void fetchNextPage(),
    retry: () => void refetch()
  };
};
