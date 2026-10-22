import { ZodError } from "zod";

import { isAxiosError } from "axios";

import type { Order } from "./types";

export const POLL_INTERVAL_MS = 3_000;

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
export const isSettled = (order: Order, fetchedAt: number) =>
  order.status === "paid" ||
  order.status === "needs_review" ||
  order.status === "refunded" ||
  fetchedAt > new Date(order.expiresAt).getTime() + LATE_WEBHOOK_GRACE_MS;

// 404 (not ours / missing) and 400 (bad id) won't change on retry.
export const isNotFoundError = (error: unknown) =>
  isAxiosError(error) &&
  error.response !== undefined &&
  error.response.status < 500 &&
  error.response.status !== 429;

// Network errors, 5xx and 429 (per user, 60/min — resets within a minute) are
// polled through, but not forever: with no order yet, give up after this many
// errors (all of them in a row then); with an order, once errors outlast the
// last good response by this long, or run past the grace window.
const MAX_ERRORS_WITHOUT_ORDER = 10;
const ERROR_STREAK_MS = 30_000;

export interface PollState {
  data: Order | undefined;
  dataUpdatedAt: number;
  error: unknown;
  errorUpdatedAt: number;
  errorUpdateCount: number;
  status: "pending" | "error" | "success";
}

// Stop retrying: not found, a response that doesn't match the schema (won't
// fix itself), or a long error streak.
export const hasGivenUp = (state: PollState) => {
  if (state.status !== "error") return false;
  if (isNotFoundError(state.error) || state.error instanceof ZodError) return true;
  if (!state.data) return state.errorUpdateCount >= MAX_ERRORS_WITHOUT_ORDER;

  return (
    state.errorUpdatedAt - state.dataUpdatedAt > ERROR_STREAK_MS ||
    state.errorUpdatedAt > new Date(state.data.expiresAt).getTime() + LATE_WEBHOOK_GRACE_MS
  );
};
