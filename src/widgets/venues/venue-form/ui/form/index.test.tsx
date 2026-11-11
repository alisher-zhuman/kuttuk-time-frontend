import { api, fixtures, server } from "@mocks";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests";
import { delay, http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { type AdminVenueDetail } from "@entities/venue";

import { VenueForm } from "./index";

const venue = (overrides: Partial<AdminVenueDetail> = {}): AdminVenueDetail => ({
  id: 1,
  name: "Coffeeroom",
  description: { ru: "Кофе", kg: "Кофе", en: "Coffee" },
  categories: [1],
  nominals: [500, 1000],
  validityMonths: 12,
  address: "ул. Киевская 95",
  mapUrl: "https://go.2gis.com/abc",
  logo: "https://res.cloudinary.com/demo/image/upload/v1/logo.png",
  slug: "coffeeroom",
  isActive: true,
  createdAt: "2026-06-01T00:00:00.000Z",
  merchantId: 10,
  ...overrides
});

const options = fixtures.venueOptions;

const answer = ({ rejectMapUrl = false } = {}) => {
  const patches: Record<string, unknown>[] = [];

  server.use(
    http.get(api("/categories"), () => HttpResponse.json([{ id: 1, name: "Кофейни", order: 0 }])),
    http.get(api("/admin/merchants"), () =>
      HttpResponse.json([fixtures.adminMerchant()])
    ),
    http.patch(api("/admin/venues/1"), async ({ request }) => {
      patches.push((await request.json()) as Record<string, unknown>);

      if (rejectMapUrl) {
        return HttpResponse.json(
          { message: ["mapUrl must be a 2GIS, Google Maps or Yandex Maps https link"], error: "Bad Request", statusCode: 400 },
          { status: 400 }
        );
      }

      return HttpResponse.json(venue());
    })
  );

  return patches;
};

const save = () => window.__telegram.emit("main_button_pressed");
const mainButton = () => window.__telegram.last("web_app_setup_main_button");
const nameInput = () => screen.getByPlaceholderText("Например: Sierra Coffee");

describe("the venue form", () => {
  it("shows a deleted category as a chip and won't save until it's deselected", async () => {
    const patches = answer();
    renderWithProviders(<VenueForm options={options} variant={{ kind: "edit", venue: venue({ categories: [1, 99] }) }} />);

    const removed = await screen.findByRole("button", { name: "Удалённая категория" });
    await userEvent.type(nameInput(), " 2");
    save();

    expect(await screen.findByText("Категория удалена - снимите её")).toBeInTheDocument();
    expect(patches).toEqual([]);

    await userEvent.click(removed);
    save();

    await waitFor(() => expect(patches).toHaveLength(1));
    expect(patches[0]).toMatchObject({ categories: [1], name: "Coffeeroom 2" });
  });

  it("limits the name to nameMaxLength", async () => {
    const patches = answer();
    renderWithProviders(
      <VenueForm options={{ ...options, nameMaxLength: 10 }} variant={{ kind: "edit", venue: venue({ name: "Coffeeroom Bishkek" }) }} />
    );

    await screen.findByRole("button", { name: "Кофейни" });
    expect(nameInput()).toHaveAttribute("maxlength", "10");

    // A saved name over the limit is caught on save.
    await userEvent.click(screen.getByRole("button", { name: "Кофейни" }));
    await userEvent.click(screen.getByRole("button", { name: "Кофейни" }));
    save();

    expect(await screen.findByText("Не длиннее 10 символов")).toBeInTheDocument();
    expect(patches).toEqual([]);
  });

  it("holds «Сохранить» while the logo uploads, then saves the new logo", async () => {
    const patches = answer();
    server.use(
      http.post(api("/upload"), async () => {
        await delay(300);

        return HttpResponse.json({ url: "https://res.cloudinary.com/demo/image/upload/v2/new.png" });
      })
    );
    const { container } = renderWithProviders(<VenueForm options={options} variant={{ kind: "edit", venue: venue() }} />);

    await screen.findByRole("button", { name: "Кофейни" });
    await userEvent.type(nameInput(), " 2");
    const file = new File(["png"], "logo.png", { type: "image/png" });
    await userEvent.upload(container.querySelector<HTMLInputElement>("input[type=file]")!, file);

    expect(mainButton()).toMatchObject({ is_active: false });
    save();
    expect(patches).toEqual([]);

    await waitFor(() => expect(mainButton()).toMatchObject({ is_active: true }));
    save();

    await waitFor(() => expect(patches).toHaveLength(1));
    expect(patches[0]).toMatchObject({ logo: "https://res.cloudinary.com/demo/image/upload/v2/new.png" });
  });

  it("sends one PATCH for a double tap on «Сохранить»", async () => {
    const patches = answer();
    renderWithProviders(<VenueForm options={options} variant={{ kind: "edit", venue: venue() }} />);

    await screen.findByRole("button", { name: "Кофейни" });
    await userEvent.type(nameInput(), " 2");
    save();
    save();

    await waitFor(() => expect(patches).toHaveLength(1));
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(patches).toHaveLength(1);
  });

  it("sends the address and the map link as typed, trimmed", async () => {
    const patches = answer();
    renderWithProviders(<VenueForm options={options} variant={{ kind: "edit", venue: venue() }} />);

    await screen.findByRole("button", { name: "Кофейни" });
    // Taken once: while it's empty its error joins the label's text.
    const address = screen.getByLabelText("Адрес");
    await userEvent.clear(address);
    await userEvent.type(address, "  ул. Токтогула 1  ");
    save();

    await waitFor(() => expect(patches).toHaveLength(1));
    expect(patches[0]).toMatchObject({ address: "ул. Токтогула 1", mapUrl: "https://go.2gis.com/abc" });
  });

  it.each(["Адрес", "Ссылка на карту"])("won't save without «%s» - «Сохранить» is off", async (field) => {
    const patches = answer();
    renderWithProviders(<VenueForm options={options} variant={{ kind: "edit", venue: venue() }} />);

    await screen.findByRole("button", { name: "Кофейни" });
    await userEvent.clear(screen.getByLabelText(field));

    await waitFor(() => expect(mainButton()?.["is_active"]).toBe(false));
    save();
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(patches).toEqual([]);
  });

  it("a map link the backend refuses (not 2GIS / Google / Yandex) says which ones work", async () => {
    answer({ rejectMapUrl: true });
    renderWithProviders(<VenueForm options={options} variant={{ kind: "edit", venue: venue() }} />);

    await screen.findByRole("button", { name: "Кофейни" });
    const mapUrl = screen.getByLabelText("Ссылка на карту");
    await userEvent.clear(mapUrl);
    await userEvent.type(mapUrl, "https://example.com/map");
    save();

    expect(await screen.findByText("Нужна ссылка из 2GIS, Google Maps или Яндекс Карт")).toBeInTheDocument();
  });
});
