import { api, server } from "@mocks";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@tests";
import { http,HttpResponse } from "msw/http";
import { describe, expect, it } from "vitest";

import { useAppModeStore } from "@shared/store";

import { VenueList } from "./index";

const venue = { id: 1, slug: "coffeeroom", name: "Coffeeroom", description: "Кофейня", logo: "https://res.cloudinary.com/demo/image/upload/a.jpg", minNominal: 500 };

const renderList = async (mode: "telegram" | "web") => {
  useAppModeStore.setState({ mode });
  server.use(http.get(api("/venues"), () => HttpResponse.json([venue])));
  renderWithProviders(<VenueList category={null} search="" />);

  return (await screen.findByText("Coffeeroom")).closest("ul")!;
};

describe("the catalog's cards", () => {
  // By the window's width, not the mode: a stretched Telegram Desktop window
  // gets the grid like the website.
  it.each(["web", "telegram"] as const)("%s - one column on a phone, 2-3 a row in a wide window", async (mode) => {
    const list = await renderList(mode);

    expect(list).toHaveClass("grid-cols-1", "sm:grid-cols-2", "lg:grid-cols-3");
  });
});
