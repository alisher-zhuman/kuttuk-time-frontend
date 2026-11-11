import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests";
import { describe, expect, it } from "vitest";

import { VenuePlace } from "./index";

describe("where the venue is", () => {
  it("the address and «Открыть на карте» opening the map link", async () => {
    renderWithProviders(<VenuePlace address="ул. Киевская 95" mapUrl="https://go.2gis.com/abc" />);

    expect(screen.getByText("ул. Киевская 95")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Открыть на карте" }));
    expect(window.__telegram.last("web_app_open_link")?.["url"]).toBe("https://go.2gis.com/abc");
  });
});
