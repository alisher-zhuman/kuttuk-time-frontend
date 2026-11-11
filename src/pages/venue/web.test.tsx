import { api, server } from "@mocks";
import { act, screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@tests";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";

import { ROUTE_PATTERNS } from "@shared/constants";
import { useAppModeStore, useWebMainButtonStore } from "@shared/store";

import { VenuePage } from "./index";

const goToUrl = vi.hoisted(() => vi.fn());

vi.mock("@shared/helpers", async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  goToUrl
}));

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
});
