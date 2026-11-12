import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests";
import { describe, expect, it } from "vitest";

import { SITE_PATTERNS } from "@shared/constants";
import { useAppModeStore } from "@shared/store";

import { Footer } from "./index";

describe("the website's footer", () => {
  it.each([
    ["О нас", SITE_PATTERNS.ABOUT],
    ["Оферта", SITE_PATTERNS.OFFER],
    ["Политика конфиденциальности", SITE_PATTERNS.PRIVACY]
  ])("«%s»", async (name, path) => {
    useAppModeStore.setState({ mode: "web" });
    const { router } = renderWithProviders(<Footer />, { route: SITE_PATTERNS.HOME });

    await userEvent.click(screen.getByRole("button", { name }));
    expect(router.state.location.pathname).toBe(path);
  });

  it("only on the catalog - other screens keep the brand line", () => {
    useAppModeStore.setState({ mode: "web" });
    renderWithProviders(<Footer />, { route: "/app/venues/coffeeroom" });

    expect(screen.queryByRole("button", { name: "Оферта" })).toBeNull();
    expect(screen.queryByText("Оплата через Finik")).toBeNull();
    expect(screen.getByText("С любовью KuttukTime ♥")).toBeTruthy();
  });

  it("the catalog ends with the brand line too", () => {
    useAppModeStore.setState({ mode: "web" });
    renderWithProviders(<Footer />, { route: SITE_PATTERNS.HOME });

    expect(screen.getByText("С любовью KuttukTime ♥")).toBeTruthy();
  });
});
