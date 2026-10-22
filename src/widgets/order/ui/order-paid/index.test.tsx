import { fixtures } from "@mocks";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@tests";
import { describe, expect, it } from "vitest";

import { type Order } from "@entities/order";

import { OrderPaid } from "./index";

// The schema itself is tested in entities/order; here the fixture is the order.
const paid = (raw: unknown) => raw as Extract<Order, { status: "paid" }>;

const mainButton = () => window.__telegram.last("web_app_setup_main_button");

describe("the paid order screen", () => {
  it("shows the code, its QR and «Подарить» for an active certificate", async () => {
    renderWithProviders(<OrderPaid order={paid(fixtures.orders.paid)} venueName="Coffeeroom" />);

    expect(await screen.findByText("0471 8263")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Покажите QR на кассе" })).toBeInTheDocument();
    expect(mainButton()).toMatchObject({ text: "Подарить", is_visible: true });
  });

  it.each([
    ["used", fixtures.orders.paidUsed, "Использован 22.10.2026"],
    ["expired", fixtures.orders.paidExpired, "Истёк 21.10.2026"]
  ])("hides the QR and «Подарить» for a %s certificate and says why", async (_, raw, caption) => {
    renderWithProviders(<OrderPaid order={paid(raw)} venueName="Coffeeroom" />);

    expect(await screen.findByText(caption)).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: "Покажите QR на кассе" })).not.toBeInTheDocument();
    expect(mainButton()?.["is_visible"]).not.toBe(true);
  });
});
