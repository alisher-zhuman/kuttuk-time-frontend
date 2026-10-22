import { api as apiUrl, server } from "@mocks";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it } from "vitest";

import { useAuthStore, useViewModeStore } from "@shared/store";

// The app's i18n (language from the Telegram user, here ru) — as at startup.
import "@tests";

import { api } from "./api";

const PROBE = apiUrl("/probe");
const LOG_IN = apiUrl("/auth/log-in");

const signedIn = () => {
  useAuthStore.setState({ accessToken: "old", role: "merchant", isReady: true, isSessionExpired: false });
  useViewModeStore.setState({ viewMode: "merchant" });
};

// The probe answers 401 to the old token and 200 to a fresh one.
const probeExpiringOldToken = () =>
  http.get(PROBE, ({ request }) =>
    request.headers.get("Authorization") === "Bearer old"
      ? HttpResponse.json({}, { status: 401 })
      : HttpResponse.json({ ok: true })
  );

const ask = async () => {
  try {
    return (await api.get("/probe")).data as unknown;
  } catch {
    return "rejected";
  }
};

beforeEach(() => {
  signedIn();
});

describe("401 → re-login", () => {
  it("logs in again with initData and retries the request with the new token", async () => {
    const logIns: string[] = [];

    server.use(
      probeExpiringOldToken(),
      http.post(LOG_IN, async ({ request }) => {
        logIns.push(((await request.json()) as { initData: string }).initData);

        return HttpResponse.json({ accessToken: "fresh", role: "merchant" });
      })
    );

    expect(await ask()).toEqual({ ok: true });
    expect(logIns).toHaveLength(1);
    expect(logIns[0]).toContain("auth_date");
    expect(useAuthStore.getState().accessToken).toBe("fresh");
  });

  it("ends the session when the re-login itself is 401 (initData older than 24h)", async () => {
    server.use(probeExpiringOldToken(), http.post(LOG_IN, () => HttpResponse.json({}, { status: 401 })));

    expect(await ask()).toBe("rejected");
    expect(useAuthStore.getState().accessToken).toBeNull();
    expect(useAuthStore.getState().isSessionExpired).toBe(true);
  });

  it.each([
    ["a 5xx", () => HttpResponse.json({}, { status: 503 })],
    ["a network error", () => HttpResponse.error()]
  ])("keeps the token and role when the re-login fails with %s", async (_, answer) => {
    server.use(probeExpiringOldToken(), http.post(LOG_IN, answer));

    expect(await ask()).toBe("rejected");
    // An owner mid-redemption must not be thrown out of the cabinet.
    expect(useAuthStore.getState()).toMatchObject({ accessToken: "old", role: "merchant", isSessionExpired: false });
    expect(useViewModeStore.getState().viewMode).toBe("merchant");
  });

  it("switches the screens when the re-login brings a different role", async () => {
    server.use(
      probeExpiringOldToken(),
      http.post(LOG_IN, () => HttpResponse.json({ accessToken: "fresh", role: "user" }))
    );

    await ask();

    expect(useAuthStore.getState().role).toBe("user");
    expect(useViewModeStore.getState().viewMode).toBe("user");
  });

  it("shares one re-login between requests that expired together", async () => {
    let logIns = 0;

    server.use(
      probeExpiringOldToken(),
      http.post(LOG_IN, () => {
        logIns += 1;

        return HttpResponse.json({ accessToken: "fresh", role: "merchant" });
      })
    );

    await Promise.all([ask(), ask(), ask()]);

    expect(logIns).toBe(1);
  });
});

describe("headers", () => {
  it("sends the app language with every request — the bot writes in it", async () => {
    let language: string | null = null;

    server.use(
      http.get(PROBE, ({ request }) => {
        language = request.headers.get("Accept-Language");

        return HttpResponse.json({});
      })
    );

    await ask();

    expect(language).toBe("ru");
  });
});
