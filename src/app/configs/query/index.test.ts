import { AxiosError } from "axios";
import { describe, expect, it } from "vitest";

import { api } from "@shared/api";
import { REQUEST_TIMEOUT_MS } from "@shared/constants";

import { createQueryClient } from "./index";

const retry = createQueryClient().getDefaultOptions().queries?.retry as (count: number, error: unknown) => boolean;

describe("a hung connection ends in an error, not an endless spinner", () => {
  it("every request has a timeout", () => {
    expect(api.defaults.timeout).toBe(REQUEST_TIMEOUT_MS);
  });

  it("a timeout isn't retried - «Повторить» right away", () => {
    expect(retry(0, new AxiosError("timeout", "ECONNABORTED"))).toBe(false);
  });

  it("a dropped connection is retried once", () => {
    expect(retry(0, new AxiosError("Network Error", "ERR_NETWORK"))).toBe(true);
    expect(retry(1, new AxiosError("Network Error", "ERR_NETWORK"))).toBe(false);
  });
});
