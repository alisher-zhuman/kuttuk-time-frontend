import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests";
import { describe, expect, it } from "vitest";

import { ROUTE_PATTERNS } from "@shared/constants";

import { AboutServiceSection } from "./index";

describe("«О сервисе» in the Mini App's profile", () => {
  it.each([
    ["Как это работает", ROUTE_PATTERNS.FAQ],
    ["О нас", ROUTE_PATTERNS.ABOUT],
    ["Оферта", ROUTE_PATTERNS.OFFER],
    ["Политика конфиденциальности", ROUTE_PATTERNS.PRIVACY]
  ])("«%s»", async (name, path) => {
    const { router } = renderWithProviders(<AboutServiceSection />, { route: ROUTE_PATTERNS.PROFILE });

    await userEvent.click(screen.getByRole("button", { name }));

    expect(router.state.location.pathname).toBe(path);
  });
});
