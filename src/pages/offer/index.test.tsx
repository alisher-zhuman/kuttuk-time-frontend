import { screen } from "@testing-library/react";
import { renderWithProviders } from "@tests";
import { describe, expect, it } from "vitest";

import { OfferPage } from "./index";

describe("«Оферта»", () => {
  it("the Russian text as is", () => {
    renderWithProviders(<OfferPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Публичная оферта о продаже подарочных сертификатов KuttukTime" })
    ).toBeInTheDocument();
    expect(screen.getByText(/ИНН: 21610200750676/)).toBeInTheDocument();
    expect(screen.queryByText("Текст на русском языке")).not.toBeInTheDocument();
  });

  it("in another language - the same Russian text with a note", () => {
    renderWithProviders(<OfferPage />, { language: "en" });

    expect(screen.getByText("The text is in Russian")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: /^Публичная оферта/ })).toBeInTheDocument();
  });
});
