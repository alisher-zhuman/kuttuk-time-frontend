import { screen } from "@testing-library/react";
import { renderWithProviders } from "@tests";
import { describe, expect, it } from "vitest";

import { MerchantOwnerStatus } from "./index";

describe("is the owner connected", () => {
  it("last seen and the bot reaches them", () => {
    renderWithProviders(<MerchantOwnerStatus owner={{ lastSeenAt: "2026-11-10T06:00:00.000Z", botReachable: true }} />);

    expect(screen.getByText("Заходил 10.11.2026")).toBeInTheDocument();
    expect(screen.getByText("Бот: доходит")).toBeInTheDocument();
  });

  it("never opened the app, the bot doesn't reach them", () => {
    renderWithProviders(<MerchantOwnerStatus owner={{ lastSeenAt: null, botReachable: false }} />);

    expect(screen.getByText("Ни разу не заходил")).toBeInTheDocument();
    expect(screen.getByText("Бот: не доходит")).toBeInTheDocument();
  });

  it("nothing about the bot until it tried", () => {
    renderWithProviders(<MerchantOwnerStatus owner={{ lastSeenAt: null, botReachable: null }} />);

    expect(screen.queryByText(/Бот:/)).not.toBeInTheDocument();
  });
});
