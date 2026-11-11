import { screen } from "@testing-library/react";
import { renderWithProviders } from "@tests";
import { describe, expect, it } from "vitest";

import { PrivacyPage } from "./index";

describe("«Политика конфиденциальности»", () => {
  it("the Russian text; in kg with a note", () => {
    renderWithProviders(<PrivacyPage />, { language: "kg" });

    expect(screen.getByText("Текст орус тилинде")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Политика конфиденциальности KuttukTime" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "2. Какие данные мы получаем" })).toBeInTheDocument();
  });
});
