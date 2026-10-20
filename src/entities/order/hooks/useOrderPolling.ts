import { useEffect } from "react";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { miniApp, useSignal } from "@tma.js/sdk-react";
import { isAxiosError } from "axios";

import { getOrder } from "../api";
import { orderKeys } from "../model/keys";
import type { Order } from "../model/types";

const POLL_INTERVAL_MS = 3_000;

// A payment made just before the QR expired is still honoured (expired → paid
// on the backend), and Finik retries a failed webhook every 30 s for its first
// 5 attempts — so keep polling 3 min past expiresAt. Longer is pointless: if
// our server was down, Finik's retries stretch over a day.
const LATE_WEBHOOK_GRACE_MS = 3 * 60_000;

// paid / needs_review come from the webhook; needs_review is later resolved by
// hand into paid or refunded (terminal). Stopping on needs_review is still
// right: the manual review takes hours, and reopening the screen fetches the
// status again. expired is not final within the grace window. Comparing against the fetch
// time (not "now") makes the first response received after the deadline the
// final request.
const isSettled = (order: Order, fetchedAt: number) =>
  order.status === "paid" ||
  order.status === "needs_review" ||
  order.status === "refunded" ||
  fetchedAt > new Date(order.expiresAt).getTime() + LATE_WEBHOOK_GRACE_MS;

// 404 (not ours / missing) and 400 (bad id) won't change on retry. 429 will —
// the throttler is keyed on the proxy IP, so other users can trip it — and so
// will network errors and 5xx; keep polling through those.
const isPermanentError = (error: unknown) =>
  isAxiosError(error) &&
  error.response !== undefined &&
  error.response.status < 500 &&
  error.response.status !== 429;

export const useOrderPolling = (orderId: string | undefined) => {
  // False while another mini app / the bank app is in front (visibility_changed,
  // v8.0+; stays true on older clients). Document visibility alone doesn't
  // cover it. Disabling pauses the interval; re-enabling with staleTime 0
  // refetches at once — the user is back from paying.
  const isAppActive = useSignal(miniApp.isActive);

  const queryClient = useQueryClient();

  const { data, dataUpdatedAt, error, isLoading, isError } = useQuery({
    queryKey: orderKeys.detail(orderId ?? ""),
    queryFn: ({ signal }) => getOrder(orderId!, signal),
    enabled: Boolean(orderId) && isAppActive,
    // Global defaults don't fit polling: no stale data from another order, no
    // extra retry on top of the interval, refetch on every return to the tab.
    staleTime: 0,
    placeholderData: () => undefined,
    retry: false,
    refetchOnWindowFocus: "always",
    // The interval pauses on its own while the document is hidden
    // (refetchIntervalInBackground is false), and an in-flight request is
    // reused rather than duplicated by both the interval and focus refetches.
    refetchInterval: (query) => {
      const { data: order, dataUpdatedAt: fetchedAt, error: queryError } = query.state;

      if (isPermanentError(queryError)) {
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

  return {
    order: data,
    // True once polling has stopped for good: paid, needs_review, or the
    // grace window after expiresAt has passed (expired, or pending the cron
    // hasn't flipped yet).
    isSettled: data ? isSettled(data, dataUpdatedAt) : isPermanentError(error),
    isLoading,
    isError,
    error
  };
};
