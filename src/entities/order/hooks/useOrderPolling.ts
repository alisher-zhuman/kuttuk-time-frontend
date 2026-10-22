import { useEffect } from "react";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { miniApp, useSignal } from "@tma.js/sdk-react";

import { getOrder } from "../api";
import { orderKeys } from "../model/keys";
import { hasGivenUp, isNotFoundError, isSettled, POLL_INTERVAL_MS } from "../model/polling";

export const useOrderPolling = (orderId: string | undefined) => {
  // False while another mini app / the bank app is in front (visibility_changed,
  // v8.0+; stays true on older clients). Document visibility alone doesn't
  // cover it. Disabling pauses the interval; re-enabling with staleTime 0
  // refetches at once — the user is back from paying.
  const isAppActive = useSignal(miniApp.isActive);

  const queryClient = useQueryClient();

  const { data, dataUpdatedAt, error, errorUpdatedAt, errorUpdateCount, status: queryStatus, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: orderKeys.detail(orderId ?? ""),
    queryFn: ({ signal }) => getOrder(orderId!, signal),
    enabled: Boolean(orderId) && isAppActive,
    // Global defaults don't fit polling: no stale data from another order, no
    // extra retry on top of the interval, refetch on every return to the tab.
    staleTime: 0,
    retry: false,
    refetchOnWindowFocus: "always",
    // The interval pauses on its own while the document is hidden
    // (refetchIntervalInBackground is false), and an in-flight request is
    // reused rather than duplicated by both the interval and focus refetches.
    refetchInterval: (query) => {
      const { data: order, dataUpdatedAt: fetchedAt } = query.state;

      if (hasGivenUp(query.state)) {
        return false;
      }

      if (order && isSettled(order, fetchedAt)) {
        return false;
      }

      return POLL_INTERVAL_MS;
    }
  });

  const status = data?.status;

  // The webhook created the certificate in the same transaction that marked
  // the order paid — refresh "My certificates". Literal key: entities can't
  // import each other (FSD), and the certificate entity owns ["certificates"].
  useEffect(() => {
    if (status === "paid") {
      void queryClient.invalidateQueries({ queryKey: ["certificates"] });
    }
  }, [status, queryClient]);

  const gaveUp = hasGivenUp({
    data,
    dataUpdatedAt,
    error,
    errorUpdatedAt,
    errorUpdateCount,
    status: queryStatus
  });

  return {
    order: data,
    // True once polling has stopped for good: paid, needs_review, or the
    // grace window after expiresAt has passed (expired, or pending the cron
    // hasn't flipped yet).
    isSettled: data ? isSettled(data, dataUpdatedAt) : false,
    // 404 / 400: not ours or missing.
    isNotFound: !data && isNotFoundError(error),
    // Polling stopped on errors (a long streak, or a response that doesn't
    // match the schema) — offer a retry instead of an endless loader.
    isFailed: gaveUp && !isNotFoundError(error),
    // A manual retry; a success resumes the interval.
    retry: () => void refetch(),
    isFetching,
    isLoading,
    isError,
    error
  };
};
