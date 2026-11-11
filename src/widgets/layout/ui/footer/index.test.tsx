import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests";
import { describe, expect, it } from "vitest";

import { ROUTE_PATTERNS } from "@shared/constants";
import { useAppModeStore } from "@shared/store";

import { Footer } from "./index";

describe("the website's footer", () => {
  it.each([
    ["О нас", ROUTE_PATTERNS.ABOUT],
    ["Оферта", ROUTE_PATTERNS.OFFER],
    ["Политика конфиденциальности", ROUTE_PATTERNS.PRIVACY]
  ])("«%s»", async (name, path) => {
    useAppModeStore.setState({ mode: "web" });
    const { router } = renderWithProviders(<Footer />);

    await userEvent.click(screen.getByRole("button", { name }));
    expect(router.state.location.pathname).toBe(path);
  });
});
