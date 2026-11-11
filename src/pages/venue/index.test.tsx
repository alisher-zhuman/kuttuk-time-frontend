import { api, server } from "@mocks";
import { act, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { ROUTE_PATTERNS } from "@shared/constants";

import { VenuePage } from "./index";

const venue = (nominals: number[]) => ({
  id: 1,
  name: "Coffeeroom",
  description: "Кофейня",
  logo: "https://res.cloudinary.com/demo/image/upload/v1/logo.png",
  nominals,
  validityMonths: 3,
  address: "ул. Киевская 95",
  mapUrl: "https://go.2gis.com/abc"
});

const pressBuy = () => act(() => window.__telegram.emit("main_button_pressed"));

describe("«Купить» on a page that went stale", () => {
  it("a 400 (the nominal was removed) reloads the venue - today's nominals show", async () => {
    let nominals = [500, 1000];
    server.use(
      http.get(api("/venues/1"), () => HttpResponse.json(venue(nominals))),
      http.post(api("/orders"), () => {
        nominals = [2000];
        return HttpResponse.json({ message: "Nominal not offered" }, { status: 400 });
      })
    );
    window.__telegram.replies.writeAccess = "allowed";
    renderWithProviders(<VenuePage />, { route: "/app/venues/1", path: ROUTE_PATTERNS.VENUE });

    expect(await screen.findByText("Действует 3 месяца")).toBeInTheDocument();
    pressBuy();

    expect(await screen.findByRole("button", { name: /2\s000/ })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^1\s000/ })).not.toBeInTheDocument();
    await waitFor(() =>
      expect(String(window.__telegram.last("web_app_open_popup")?.["message"])).toContain("мы обновили страницу")
    );
  });

  it("a 400 because the venue was switched off: the reload finds it gone", async () => {
    let isGone = false;
    server.use(
      http.get(api("/venues/1"), () =>
        isGone ? HttpResponse.json({}, { status: 404 }) : HttpResponse.json(venue([500]))
      ),
      http.post(api("/orders"), () => {
        isGone = true;
        return HttpResponse.json({ message: "Venue is not active" }, { status: 400 });
      })
    );
    window.__telegram.replies.writeAccess = "allowed";
    renderWithProviders(<VenuePage />, { route: "/app/venues/1", path: ROUTE_PATTERNS.VENUE });

    await screen.findByText("Действует 3 месяца");
    pressBuy();

    expect(await screen.findByText(/не найдено/i)).toBeInTheDocument();
  });
});

describe("the storefront", () => {
  it("says the certificate can be a gift, and where the venue is", async () => {
    server.use(
      http.get(api("/venues/1"), () => HttpResponse.json(venue([500])))
    );
    renderWithProviders(<VenuePage />, { route: "/app/venues/1", path: ROUTE_PATTERNS.VENUE });

    expect(await screen.findByText("После оплаты сертификат можно подарить другу")).toBeInTheDocument();
    expect(screen.getByText("ул. Киевская 95")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Открыть на карте" })).toBeInTheDocument();
  });

  it("paying accepts the offer and the privacy policy - both open from the line above «Купить»", async () => {
    server.use(http.get(api("/venues/1"), () => HttpResponse.json(venue([500]))));
    const { router } = renderWithProviders(<VenuePage />, { route: "/app/venues/1", path: ROUTE_PATTERNS.VENUE });

    expect(
      await screen.findByText((_, element) =>
        element?.tagName === "P" &&
        element.textContent === "Оплачивая, вы соглашаетесь с офертой и политикой конфиденциальности"
      )
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "офертой" }));
    expect(router.state.location.pathname).toBe(ROUTE_PATTERNS.OFFER);
  });

  it("the privacy policy link", async () => {
    server.use(http.get(api("/venues/1"), () => HttpResponse.json(venue([500]))));
    const { router } = renderWithProviders(<VenuePage />, { route: "/app/venues/1", path: ROUTE_PATTERNS.VENUE });

    await userEvent.click(await screen.findByRole("button", { name: "политикой конфиденциальности" }));
    expect(router.state.location.pathname).toBe(ROUTE_PATTERNS.PRIVACY);
  });
});
