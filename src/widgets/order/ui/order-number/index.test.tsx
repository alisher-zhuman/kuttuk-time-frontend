import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests";
import { describe, expect, it } from "vitest";

import { OrderNumber } from "./index";

describe("«Заказ №…» on the buyer's order", () => {
  it("shows the number and copies just the 8 characters", async () => {
    const user = userEvent.setup();
    renderWithProviders(<OrderNumber number="A1B2C3D4" />);

    await user.click(screen.getByRole("button", { name: "Заказ №A1B2C3D4" }));

    expect(await navigator.clipboard.readText()).toBe("A1B2C3D4");
    expect(await screen.findByText("Номер скопирован")).toBeInTheDocument();
  });
});
