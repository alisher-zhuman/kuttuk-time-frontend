import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests";
import { describe, expect, it } from "vitest";

import { ROUTE_PATTERNS } from "@shared/constants";

import { AboutPage } from "./index";

describe("«О нас»", () => {
  it("the backend's text in the person's language, without the file's own heading", () => {
    renderWithProviders(<AboutPage />, { language: "kg" });

    expect(screen.getByRole("heading", { level: 1, name: "Биз жөнүндө" })).toBeInTheDocument();
    expect(screen.getByText(/Жеке ишкер Жуманов Алишер Бакирович/)).toBeInTheDocument();
    expect(screen.queryByText(/тексты для сайта/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Индивидуальный предприниматель/)).not.toBeInTheDocument();
  });

  it.each([
    ["ru", "Публичная оферта", "Политика конфиденциальности"],
    ["kg", "Ачык оферта", "Купуялуулук саясаты"],
    ["en", "Public offer", "Privacy policy"]
  ])("%s: the offer and the privacy policy open from the text", async (language, offer, privacy) => {
    const { router } = renderWithProviders(<AboutPage />, { language });

    await userEvent.click(screen.getByRole("button", { name: offer }));
    expect(router.state.location.pathname).toBe(ROUTE_PATTERNS.OFFER);

    await userEvent.click(screen.getByRole("button", { name: privacy }));
    expect(router.state.location.pathname).toBe(ROUTE_PATTERNS.PRIVACY);
  });
});
