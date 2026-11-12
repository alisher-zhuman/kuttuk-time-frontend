import { api, fixtures, giftHandlers, server } from "@mocks";
import { act, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { installTelegramLogin, renderWithProviders } from "@tests";
import { http, HttpResponse } from "msw/http";
import { describe, expect, it } from "vitest";

import { ROUTE_PATTERNS } from "@shared/constants";
import { useAppModeStore, useAuthStore, useWebMainButtonStore } from "@shared/store";

import { GiftPage } from "./index";

const INVITE =
  "Войдите через Telegram, чтобы забрать подарок: сертификат сохранится в вашем аккаунте, код и напоминания придут в Telegram";

const open = ({ isGuest, claim }: { isGuest: boolean; claim?: "ok" | "telegram_required" }) => {
  const gifts = giftHandlers(claim ? { claim } : {});
  server.use(
    ...gifts.handlers,
    http.post(api("/auth/telegram-oidc"), () => HttpResponse.json({ accessToken: "tg-jwt", role: "user", merged: true }))
  );
  useAppModeStore.setState({ mode: "web" });
  useAuthStore.setState({ accessToken: "jwt", role: "user", isGuest });

  const view = renderWithProviders(<GiftPage />, { route: `/gift/${fixtures.GIFT_TOKEN}`, path: ROUTE_PATTERNS.WEB_GIFT });

  return { ...view, calls: gifts.calls };
};

const pressClaim = async () => {
  await waitFor(() => expect(useWebMainButtonStore.getState().button?.text).toBe("Забрать подарок"));
  act(() => useWebMainButtonStore.getState().button?.onClick());
};

describe("«Забрать подарок» on the website", () => {
  it("a guest sees the gift, but claiming asks to sign in with Telegram - then it is claimed at once", async () => {
    const login = installTelegramLogin();
    const { router, calls } = open({ isGuest: true });

    expect(await screen.findByText("Вам подарок")).toBeInTheDocument();
    await pressClaim();

    expect(await screen.findByText(INVITE)).toBeInTheDocument();
    expect(calls.claims).toBe(0);

    await userEvent.click(screen.getByRole("button", { name: "Войти через Telegram" }));
    login.signIn();

    await waitFor(() => expect(router.state.location.pathname).toBe("/app/certificates/c7"));
    expect(calls.claims).toBe(1);
    expect(useAuthStore.getState()).toMatchObject({ accessToken: "tg-jwt", isGuest: false });
  });

  it("403 telegram_required (an old tab still a guest on the backend) - the same invitation", async () => {
    const { calls } = open({ isGuest: false, claim: "telegram_required" });

    await screen.findByText("Вам подарок");
    await pressClaim();

    expect(await screen.findByText(INVITE)).toBeInTheDocument();
    expect(calls.claims).toBe(1);
    expect(useAuthStore.getState().isGuest).toBe(true);
  });
});
