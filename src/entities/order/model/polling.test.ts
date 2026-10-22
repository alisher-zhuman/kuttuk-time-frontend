import { ZodError } from "zod";

import { fixtures } from "@mocks";
import { AxiosError, AxiosHeaders } from "axios";
import { describe, expect, it } from "vitest";

import { hasGivenUp, isSettled, type PollState } from "./polling";
import { OrderSchema } from "./schemas";

const order = (raw: unknown) => OrderSchema.parse(raw);
const expiresAt = new Date(fixtures.orders.pending.expiresAt).getTime();
const GRACE = 3 * 60_000;

const httpError = (status: number) =>
  new AxiosError("x", "ERR", undefined, undefined, {
    status,
    data: {},
    statusText: "",
    headers: {},
    config: { headers: new AxiosHeaders() }
  });

const state = (overrides: Partial<PollState>): PollState => ({
  data: undefined,
  dataUpdatedAt: 0,
  error: null,
  errorUpdatedAt: 0,
  errorUpdateCount: 0,
  status: "error",
  ...overrides
});

describe("isSettled — when polling stops for good", () => {
  it.each([
    ["paid", fixtures.orders.paid],
    ["needs_review", fixtures.orders.needsReview],
    ["refunded", fixtures.orders.refunded]
  ])("stops on %s", (_, raw) => {
    expect(isSettled(order(raw), expiresAt - 60_000)).toBe(true);
  });

  it("keeps polling a pending or expired order within the late-webhook grace", () => {
    expect(isSettled(order(fixtures.orders.pending), expiresAt + GRACE - 1)).toBe(false);
    // expired → paid is possible: a payment made just before the deadline.
    expect(isSettled(order(fixtures.orders.expired), expiresAt + GRACE - 1)).toBe(false);
  });

  it("stops once a response arrives past expiresAt + 3 min", () => {
    expect(isSettled(order(fixtures.orders.expired), expiresAt + GRACE + 1)).toBe(true);
  });
});

describe("hasGivenUp — errors that end polling", () => {
  it("never while the last response was fine", () => {
    expect(hasGivenUp(state({ status: "success" }))).toBe(false);
  });

  it("on 404 / 400 — the order isn't ours or doesn't exist", () => {
    expect(hasGivenUp(state({ error: httpError(404), errorUpdateCount: 1 }))).toBe(true);
  });

  it("on a response that doesn't match the schema — it won't fix itself", () => {
    expect(hasGivenUp(state({ error: new ZodError([]), errorUpdateCount: 1 }))).toBe(true);
  });

  it("keeps going through 5xx and 429, but not past 10 errors without an order", () => {
    expect(hasGivenUp(state({ error: httpError(503), errorUpdateCount: 9 }))).toBe(false);
    expect(hasGivenUp(state({ error: httpError(429), errorUpdateCount: 9 }))).toBe(false);
    expect(hasGivenUp(state({ error: httpError(503), errorUpdateCount: 10 }))).toBe(true);
  });

  it("with an order: gives up after 30 s of errors since the last good response", () => {
    const data = order(fixtures.orders.pending);
    const lastGood = expiresAt - 10 * 60_000;

    expect(hasGivenUp(state({ data, dataUpdatedAt: lastGood, error: httpError(503), errorUpdatedAt: lastGood + 29_000 }))).toBe(false);
    expect(hasGivenUp(state({ data, dataUpdatedAt: lastGood, error: httpError(503), errorUpdatedAt: lastGood + 31_000 }))).toBe(true);
  });
});
