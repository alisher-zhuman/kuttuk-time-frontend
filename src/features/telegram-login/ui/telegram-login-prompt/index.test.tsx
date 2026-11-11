import { api, server } from "@mocks";
import { act, screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@tests";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { useAppModeStore, useAuthStore } from "@shared/store";

import { TelegramLoginPrompt } from "./index";

const AUTH_DATA = { id: 777, first_name: "Айбек", auth_date: 1793780000, hash: "abc" };
const HINT = "Войдите через Telegram, чтобы не потерять сертификаты и получать напоминания о сроке";

describe("«Войти через Telegram» on the website", () => {
  it("the widget's answer merges the guest into the Telegram account - the new JWT at once, the prompt goes", async () => {
    let body: unknown;
    server.use(
      http.post(api("/auth/telegram-widget"), async ({ request }) => {
        body = await request.json();
        return HttpResponse.json({ accessToken: "tg-jwt", role: "user", merged: true });
      })
    );
    localStorage.setItem("kuttuk-time-guest-token", "g-1");
    useAppModeStore.setState({ mode: "web" });
    useAuthStore.setState({ accessToken: "guest-jwt", role: "user", isGuest: true });
    renderWithProviders(<TelegramLoginPrompt />);

    expect(screen.getByText(HINT)).toBeInTheDocument();
    // The widget's script calls this global once the buyer confirms in Telegram.
    act(() => window.onKuttukTelegramAuth?.(AUTH_DATA));

    await waitFor(() => expect(useAuthStore.getState().accessToken).toBe("tg-jwt"));
    expect(body).toEqual({ authData: AUTH_DATA, guestToken: "g-1" });
    expect(useAuthStore.getState().isGuest).toBe(false);
    expect(screen.queryByText(HINT)).not.toBeInTheDocument();
  });

  it("nothing for a signed-in buyer or in the Mini App", () => {
    useAppModeStore.setState({ mode: "web" });
    useAuthStore.setState({ isGuest: false });
    const { container } = renderWithProviders(<TelegramLoginPrompt />);

    expect(container).toBeEmptyDOMElement();

    useAppModeStore.setState({ mode: "telegram" });
    useAuthStore.setState({ isGuest: true });
    const other = renderWithProviders(<TelegramLoginPrompt />);
    expect(other.container).toBeEmptyDOMElement();
  });

  it("loads Telegram's widget asking for the bot's write access", () => {
    useAppModeStore.setState({ mode: "web" });
    useAuthStore.setState({ isGuest: true });
    const { container } = renderWithProviders(<TelegramLoginPrompt />);

    const script = container.querySelector("script");
    expect(script?.getAttribute("src")).toContain("telegram.org/js/telegram-widget.js");
    expect(script?.dataset).toMatchObject({ telegramLogin: "kuttuk_time_bot", requestAccess: "write" });
  });
});
