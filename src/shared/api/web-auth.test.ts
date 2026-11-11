import { api as apiUrl, server } from "@mocks";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it } from "vitest";

import { useAppModeStore, useAuthStore, useViewModeStore } from "@shared/store";

import "@tests";

import { api } from "./api";
import { logInAsGuest, logInWithTelegramWidget, signInOnWebsite } from "./web-auth";

const GUEST = apiUrl("/auth/guest");
const WIDGET = apiUrl("/auth/telegram-widget");

const AUTH_DATA = { id: 777, first_name: "Айбек", auth_date: 1793780000, hash: "abc" };

// What each sign-in sent, and the guest the backend hands out.
const answer = ({ widget = "ok" }: { widget?: "ok" | "expired" } = {}) => {
  const sent = { guest: [] as unknown[], widget: [] as unknown[] };

  server.use(
    http.post(GUEST, async ({ request }) => {
      const body = (await request.json()) as { guestToken?: string };
      sent.guest.push(body);

      return HttpResponse.json({ accessToken: `guest-jwt-${sent.guest.length}`, role: "user", guestToken: body.guestToken ?? "g-new" });
    }),
    http.post(WIDGET, async ({ request }) => {
      sent.widget.push(await request.json());

      return widget === "expired"
        ? HttpResponse.json({ message: "Telegram login expired" }, { status: 401 })
        : HttpResponse.json({ accessToken: "tg-jwt", role: "user", merged: true });
    })
  );

  return sent;
};

beforeEach(() => {
  useAppModeStore.setState({ mode: "web" });
});

describe("the website's guest", () => {
  it("a first visit gets a new guest; its token is kept for the next one", async () => {
    const sent = answer();

    const first = await logInAsGuest();
    expect(first).toEqual({ accessToken: "guest-jwt-1", role: "user", isGuest: true });
    expect(sent.guest[0]).toEqual({});
    expect(localStorage.getItem("kuttuk-time-guest-token")).toBe("g-new");

    await logInAsGuest();
    expect(sent.guest[1]).toEqual({ guestToken: "g-new" });
  });

  it("a 401 signs the same guest in again and retries", async () => {
    const sent = answer();
    localStorage.setItem("kuttuk-time-guest-token", "g-1");
    useAuthStore.setState({ accessToken: "old", role: "user", isGuest: true });
    server.use(
      http.get(apiUrl("/probe"), ({ request }) =>
        request.headers.get("Authorization") === "Bearer old"
          ? HttpResponse.json({}, { status: 401 })
          : HttpResponse.json({ ok: true })
      )
    );

    expect((await api.get("/probe")).data).toEqual({ ok: true });
    expect(sent.guest).toEqual([{ guestToken: "g-1" }]);
    expect(useAuthStore.getState()).toMatchObject({ accessToken: "guest-jwt-1", isGuest: true });
    // The website never shows the cabinet - the view stays the buyer's.
    expect(useViewModeStore.getState().viewMode).toBe("user");
  });
});

describe("«Войти через Telegram»", () => {
  it("sends the widget's data unchanged with the guest's token; the guest's token goes", async () => {
    const sent = answer();
    localStorage.setItem("kuttuk-time-guest-token", "g-1");

    const result = await logInWithTelegramWidget(AUTH_DATA);

    expect(sent.widget[0]).toEqual({ authData: AUTH_DATA, guestToken: "g-1" });
    expect(result).toMatchObject({ accessToken: "tg-jwt", isGuest: false, merged: true });
    expect(localStorage.getItem("kuttuk-time-guest-token")).toBeNull();
    expect(JSON.parse(localStorage.getItem("kuttuk-time-telegram-auth") ?? "null")).toEqual(AUTH_DATA);
  });

  it("the next visit signs in with the kept widget data", async () => {
    const sent = answer();
    localStorage.setItem("kuttuk-time-telegram-auth", JSON.stringify(AUTH_DATA));

    expect(await signInOnWebsite()).toEqual({ accessToken: "tg-jwt", role: "user", isGuest: false });
    expect(sent.widget[0]).toEqual({ authData: AUTH_DATA });
    expect(sent.guest).toEqual([]);
  });

  it("widget data older than 24 h (401): dropped, a guest again", async () => {
    const sent = answer({ widget: "expired" });
    localStorage.setItem("kuttuk-time-telegram-auth", JSON.stringify(AUTH_DATA));

    expect(await signInOnWebsite()).toMatchObject({ isGuest: true });
    expect(sent.guest).toHaveLength(1);
    expect(localStorage.getItem("kuttuk-time-telegram-auth")).toBeNull();
  });
});
