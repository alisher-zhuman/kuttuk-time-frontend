import { api, server } from "@mocks";
import { act, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { installTelegramLogin, renderWithProviders } from "@tests";
import { http, HttpResponse } from "msw/http";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ROUTE_PATTERNS } from "@shared/constants";
import { useAppModeStore, useAuthStore, useWebMainButtonStore } from "@shared/store";

import { VenuePage } from "./index";

const goToUrl = vi.hoisted(() => vi.fn());

vi.mock("@shared/helpers", async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  goToUrl
}));

beforeEach(() => {
  goToUrl.mockClear();
});

const INVITE =
  "Войдите через Telegram, чтобы купить: сертификат сохранится в вашем аккаунте, код и напоминания придут в Telegram";

const venue = {
  id: 1,
  name: "Coffeeroom",
  description: "Кофейня",
  logo: "https://res.cloudinary.com/demo/image/upload/v1/logo.png",
  nominals: [500, 1000],
  validityMonths: 3,
  address: "ул. Киевская 95",
  mapUrl: "https://go.2gis.com/abc"
};

describe("buying on the website", () => {
  it("«Купить» is a plain button; the order goes with channel web and the bank's page opens in this tab", async () => {
    let body: unknown;
    server.use(
      http.get(api("/venues/1"), () => HttpResponse.json(venue)),
      http.post(api("/orders"), async ({ request }) => {
        body = await request.json();
        return HttpResponse.json(
          { orderId: "o-1", paymentUrl: "https://pay.finik.test/o-1", expiresAt: "2026-11-11T10:00:00.000Z" },
          { status: 201 }
        );
      })
    );
    useAppModeStore.setState({ mode: "web" });
    const { router } = renderWithProviders(<VenuePage />, { route: "/app/venues/1", path: ROUTE_PATTERNS.VENUE });

    await screen.findByText("Действует 3 месяца");
    // No Telegram MainButton - the layout draws this one.
    expect(window.__telegram.calls.some((call) => call.name === "web_app_setup_main_button")).toBe(false);
    await waitFor(() => expect(useWebMainButtonStore.getState().button?.text).toBe("Купить"));

    act(() => useWebMainButtonStore.getState().button?.onClick());

    await waitFor(() => expect(goToUrl).toHaveBeenCalledWith("https://pay.finik.test/o-1"));
    expect(body).toEqual({ venueId: 1, nominal: 500, channel: "web" });
    // Finik brings the buyer back to /orders/<id> - no hop to the order here.
    expect(router.state.location.pathname).toBe("/app/venues/1");
  });

  it("a guest's «Купить» asks to sign in with Telegram first - then the same nominal goes to payment", async () => {
    const orders: unknown[] = [];
    server.use(
      http.get(api("/venues/1"), () => HttpResponse.json(venue)),
      http.post(api("/auth/telegram-oidc"), () => HttpResponse.json({ accessToken: "tg-jwt", role: "user", merged: true })),
      http.post(api("/orders"), async ({ request }) => {
        orders.push({ body: await request.json(), auth: request.headers.get("Authorization") });
        return HttpResponse.json(
          { orderId: "o-1", paymentUrl: "https://pay.finik.test/o-1", expiresAt: "2026-11-11T10:00:00.000Z" },
          { status: 201 }
        );
      })
    );
    useAppModeStore.setState({ mode: "web" });
    useAuthStore.setState({ accessToken: "guest-jwt", role: "user", isGuest: true });
    const login = installTelegramLogin();
    renderWithProviders(<VenuePage />, { route: "/app/venues/1", path: ROUTE_PATTERNS.VENUE });

    await userEvent.click(await screen.findByRole("button", { name: /^1\s000/ }));
    act(() => useWebMainButtonStore.getState().button?.onClick());

    expect(await screen.findByText(INVITE)).toBeInTheDocument();
    expect(orders).toEqual([]);

    // «Войти через Telegram» in the sheet → Telegram's popup answers.
    await userEvent.click(screen.getByRole("button", { name: "Войти через Telegram" }));
    login.signIn();

    await waitFor(() => expect(goToUrl).toHaveBeenCalledWith("https://pay.finik.test/o-1"));
    expect(orders).toEqual([{ body: { venueId: 1, nominal: 1000, channel: "web" }, auth: "Bearer tg-jwt" }]);
  });

  it("403 telegram_required (an old tab, a sign-out elsewhere) - the same invitation, no error popup", async () => {
    server.use(
      http.get(api("/venues/1"), () => HttpResponse.json(venue)),
      http.post(api("/orders"), () =>
        HttpResponse.json({ message: "Log in with Telegram first", error: "telegram_required", statusCode: 403 }, { status: 403 })
      )
    );
    const alert = vi.spyOn(window, "alert").mockImplementation(() => undefined);
    useAppModeStore.setState({ mode: "web" });
    useAuthStore.setState({ accessToken: "jwt", role: "user", isGuest: false });
    renderWithProviders(<VenuePage />, { route: "/app/venues/1", path: ROUTE_PATTERNS.VENUE });

    await screen.findByText("Действует 3 месяца");
    act(() => useWebMainButtonStore.getState().button?.onClick());

    expect(await screen.findByText(INVITE)).toBeInTheDocument();
    expect(useAuthStore.getState().isGuest).toBe(true);
    expect(alert).not.toHaveBeenCalled();
    expect(goToUrl).not.toHaveBeenCalled();
  });
});
