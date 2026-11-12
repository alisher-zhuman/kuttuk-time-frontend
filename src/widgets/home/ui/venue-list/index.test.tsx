import { api, server } from "@mocks";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@tests";
import { http,HttpResponse } from "msw/http";
import { describe, expect, it } from "vitest";

import { useAppModeStore } from "@shared/store";

import { VenueList } from "./index";

const venue = { id: 1, name: "Coffeeroom", description: "Кофейня", logo: "https://res.cloudinary.com/demo/image/upload/a.jpg", minNominal: 500 };

const renderList = async (mode: "telegram" | "web") => {
  useAppModeStore.setState({ mode });
  server.use(http.get(api("/venues"), () => HttpResponse.json([venue])));
  renderWithProviders(<VenueList category={null} search="" />);

  return (await screen.findByText("Coffeeroom")).closest("ul")!;
};

describe("the catalog's cards", () => {
  it("on the website - 2-3 a row on a tablet / computer", async () => {
    const list = await renderList("web");

    expect(list).toHaveClass("grid-cols-1", "sm:grid-cols-2", "lg:grid-cols-3");
  });

  it("in the Mini App - one column, whatever the window's width", async () => {
    const list = await renderList("telegram");

    expect(list).toHaveClass("grid-cols-1");
    expect(list).not.toHaveClass("sm:grid-cols-2");
  });
});
