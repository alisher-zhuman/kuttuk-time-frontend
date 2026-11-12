import { api as apiUrl, server } from "@mocks";
import { http, HttpResponse } from "msw/http";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useAppModeStore, useAuthStore, useViewModeStore } from "@shared/store";

import "@tests";

import { api } from "./api";
import {
  getWebsiteUser,
  logInAsGuest,
  logInWithTelegram,
  signInOnWebsite,
  signOutOnWebsite
} from "./web-auth";

const GUEST = apiUrl("/auth/guest");
const TELEGRAM = apiUrl("/auth/telegram-oidc");

const CLAIMS = { id: 777, name: "Айбек Асанов", preferred_username: "aibek", picture: "https://t.me/i/userpic/1.jpg" };

// Our JWT with an expiry (seconds from now) - the session checks it locally.
const jwt = (expiresIn: number) =>
  `h.${btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + expiresIn }))}.s`;

const SESSION_KEY = "kuttuk-time-telegram-session";

// What each sign-in sent, and the guest the backend hands out.
const answer = ({ telegram = "ok", accessToken = jwt(7200) }: { telegram?: "ok" | 401 | 400; accessToken?: string } = {}) => {
  const sent = { guest: [] as unknown[], telegram: [] as unknown[] };

  server.use(
    http.post(GUEST, async ({ request }) => {
      const body = (await request.json()) as { guestToken?: string };
      sent.guest.push(body);

      return HttpResponse.json({ accessToken: `guest-jwt-${sent.guest.length}`, role: "user", guestToken: body.guestToken ?? "g-new" });
    }),
    http.post(TELEGRAM, async ({ request }) => {
      sent.telegram.push(await request.json());

      return telegram === "ok"
        ? HttpResponse.json({ accessToken, role: "user", merged: true })
        : HttpResponse.json({ message: "Invalid Telegram login" }, { status: telegram });
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

describe("«Войти через Telegram» (Log In With Telegram)", () => {
  it("sends Telegram's id_token with the guest's token; the guest's token goes, our JWT and the profile are kept - not the id_token", async () => {
    const sent = answer();
    localStorage.setItem("kuttuk-time-guest-token", "g-1");

    const result = await logInWithTelegram("telegram-id-token", CLAIMS);

    expect(sent.telegram[0]).toEqual({ idToken: "telegram-id-token", guestToken: "g-1" });
    expect(result).toMatchObject({ role: "user", isGuest: false });
    expect(localStorage.getItem("kuttuk-time-guest-token")).toBeNull();
    expect(localStorage.getItem(SESSION_KEY)).not.toContain("telegram-id-token");
    expect(getWebsiteUser()).toEqual({ id: 777, fullName: "Айбек Асанов", username: "aibek", photoUrl: "https://t.me/i/userpic/1.jpg" });
  });

  it.each([401, 400] as const)("Telegram's token refused (%i): an error, still the guest", async (status) => {
    answer({ telegram: status });
    localStorage.setItem("kuttuk-time-guest-token", "g-1");

    await expect(logInWithTelegram("bad", CLAIMS)).rejects.toMatchObject({ response: { status } });
    expect(localStorage.getItem("kuttuk-time-guest-token")).toBe("g-1");
    expect(localStorage.getItem(SESSION_KEY)).toBeNull();
  });

  it("a reload while our JWT lives: still signed in, no request", async () => {
    const sent = answer();
    await logInWithTelegram("telegram-id-token", CLAIMS);

    expect(await signInOnWebsite()).toMatchObject({ isGuest: false });
    expect(sent.guest).toEqual([]);
    expect(sent.telegram).toHaveLength(1);
  });

  it("our JWT expired: the session goes, a quiet guest - the next purchase asks Telegram again", async () => {
    const sent = answer({ accessToken: jwt(-60) });
    await logInWithTelegram("telegram-id-token", CLAIMS);

    expect(await signInOnWebsite()).toMatchObject({ isGuest: true });
    expect(sent.guest).toEqual([{}]);
    expect(localStorage.getItem(SESSION_KEY)).toBeNull();
  });

  it("the backend refused the JWT (a 401 on a request): the session goes too", async () => {
    answer();
    await logInWithTelegram("telegram-id-token", CLAIMS);

    expect(await signInOnWebsite({ afterRejection: true })).toMatchObject({ isGuest: true });
    expect(getWebsiteUser()).toBeNull();
  });

  it("the old Login Widget's data is wiped from the browser", async () => {
    answer();
    localStorage.setItem("kuttuk-time-telegram-auth", JSON.stringify({ id: 777, hash: "abc" }));

    expect(await signInOnWebsite()).toMatchObject({ isGuest: true });
    expect(localStorage.getItem("kuttuk-time-telegram-auth")).toBeNull();
  });
});

describe("one quiet guest", () => {
  afterEach(() => {
    Reflect.deleteProperty(navigator, "locks");
  });

  it("in one tab: the start and a 401 at the same moment share one sign-in", async () => {
    const sent = answer();

    const [first, second] = await Promise.all([signInOnWebsite(), signInOnWebsite()]);

    expect(sent.guest).toEqual([{}]);
    expect(second).toEqual(first);
  });

  it("two tabs opened together: the second waits for the first and signs in as the same guest", async () => {
    const sent = answer();
    // The browser's Web Locks, shared by the tabs: one holder at a time.
    let tail = Promise.resolve();
    Object.defineProperty(navigator, "locks", {
      configurable: true,
      value: {
        request: (_name: string, run: () => Promise<unknown>) => {
          const turn = tail.then(run);
          tail = turn.then(() => undefined, () => undefined);
          return turn;
        }
      }
    });
    // Each tab has its own copy of the module; localStorage is shared.
    vi.resetModules();
    const tabA = await import("./web-auth");
    vi.resetModules();
    const tabB = await import("./web-auth");

    await Promise.all([tabA.signInOnWebsite(), tabB.signInOnWebsite()]);

    expect(sent.guest).toEqual([{}, { guestToken: "g-new" }]);
  });
});

describe("«Выйти»", () => {
  it("forgets the Telegram session and signs in as a new quiet guest", async () => {
    const sent = answer();
    await logInWithTelegram("telegram-id-token", CLAIMS);

    const result = await signOutOnWebsite();

    expect(result).toEqual({ accessToken: "guest-jwt-1", role: "user", isGuest: true });
    expect(sent.guest).toEqual([{}]);
    expect(localStorage.getItem(SESSION_KEY)).toBeNull();
    expect(getWebsiteUser()).toBeNull();
  });
});
