import { api, fixtures, server } from "@mocks";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests";
import { http, HttpResponse } from "msw/http";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { OrderList } from "./index";

// jsdom doesn't scroll: the load-more sentinel reports itself on screen at once.
const SeenAtOnce = class {
  callback: IntersectionObserverCallback;
  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }
  observe() {
    setTimeout(() => this.callback([{ isIntersecting: true } as IntersectionObserverEntry], this as never), 0);
  }
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
};

const original = globalThis.IntersectionObserver;

beforeEach(() => {
  globalThis.IntersectionObserver = SeenAtOnce as unknown as typeof IntersectionObserver;
});

afterEach(() => {
  globalThis.IntersectionObserver = original;
});

const NO_FILTERS = { status: null, venueId: null, merchantId: null, userId: null };

// The filter row's lists: venues and owners (searched), and a chosen one's name.
const filterLists = () => {
  const searches: string[] = [];

  server.use(
    http.get(api("/admin/venues"), ({ request }) => {
      searches.push(new URL(request.url).searchParams.get("search") ?? "");
      return HttpResponse.json([
        { id: 7, name: "Coffeeroom", logo: "https://res.cloudinary.com/demo/image/upload/v1/logo.png", isActive: true, merchantId: 10 }
      ]);
    }),
    http.get(api("/admin/venues/7"), () =>
      HttpResponse.json({
        id: 7,
        name: "Coffeeroom",
        description: { ru: "Кофе", kg: "Кофе", en: "Coffee" },
        categories: [1],
        nominals: [500],
        validityMonths: 12,
        logo: "https://res.cloudinary.com/demo/image/upload/v1/logo.png",
        slug: "coffeeroom",
        address: "ул. Киевская 95",
        mapUrl: "https://go.2gis.com/abc",
        isActive: true,
        createdAt: "2026-06-01T00:00:00.000Z",
        merchantId: 10
      })
    ),
    http.get(api("/admin/merchants"), () => HttpResponse.json([fixtures.adminMerchant()]))
  );

  return searches;
};

const order = (n: number) => ({ ...fixtures.adminOrder(`${n}1111111-1111-4111-8111-111111111111`, "pending"), venue: { id: n, name: `Venue ${n}` } });

describe("an infinite list", () => {
  it("keeps the loaded rows when the next page fails, and retries just that page", async () => {
    // The query client retries a 5xx once, so the page fails twice.
    let failures = 2;

    server.use(
      http.get(api("/admin/orders"), ({ request }) => {
        if (new URL(request.url).searchParams.get("cursor") !== "c2") {
          return HttpResponse.json({ items: [order(1), order(2)], nextCursor: "c2" });
        }

        if (failures > 0) {
          failures -= 1;

          return HttpResponse.json({}, { status: 500 });
        }

        return HttpResponse.json({ items: [order(3)], nextCursor: null });
      })
    );

    filterLists();
    renderWithProviders(<OrderList search="" filters={NO_FILTERS} onFiltersChange={() => {}} />);

    const retry = await screen.findByRole("button", { name: "Повторить" }, { timeout: 4000 });
    expect(screen.getByText("Venue 1")).toBeInTheDocument();
    expect(screen.getByText("Venue 2")).toBeInTheDocument();
    expect(screen.queryByText("Не удалось загрузить данные")).not.toBeInTheDocument();

    await userEvent.click(retry);

    expect(await screen.findByText("Venue 3")).toBeInTheDocument();
    expect(screen.getByText("Venue 1")).toBeInTheDocument();
  });

  it("one venue's orders: the pill names it, × resets it", async () => {
    let query: URLSearchParams | undefined;
    filterLists();
    server.use(
      http.get(api("/admin/orders"), ({ request }) => {
        query = new URL(request.url).searchParams;
        return HttpResponse.json({ items: [order(1)], nextCursor: null });
      })
    );
    const onFiltersChange = vi.fn();
    renderWithProviders(<OrderList search="" filters={{ ...NO_FILTERS, venueId: 7 }} onFiltersChange={onFiltersChange} />);

    expect(await screen.findByText("Заведение: Coffeeroom")).toBeInTheDocument();
    expect(query?.get("venueId")).toBe("7");

    await userEvent.click(screen.getByRole("button", { name: "Заведение: сбросить" }));
    expect(onFiltersChange).toHaveBeenCalledWith({ venueId: null });
  });

  it("picks a status from the list", async () => {
    filterLists();
    server.use(http.get(api("/admin/orders"), () => HttpResponse.json({ items: [], nextCursor: null })));
    const onFiltersChange = vi.fn();
    renderWithProviders(<OrderList search="" filters={NO_FILTERS} onFiltersChange={onFiltersChange} />);

    await userEvent.click(screen.getByRole("button", { name: "Статус" }));
    await userEvent.click(within(screen.getByRole("dialog")).getByRole("button", { name: "На проверке" }));

    expect(onFiltersChange).toHaveBeenCalledWith({ status: "needs_review" });
  });

  it("picks a venue from the list - no search box in the sheet", async () => {
    filterLists();
    server.use(http.get(api("/admin/orders"), () => HttpResponse.json({ items: [], nextCursor: null })));
    const onFiltersChange = vi.fn();
    renderWithProviders(<OrderList search="" filters={NO_FILTERS} onFiltersChange={onFiltersChange} />);

    await userEvent.click(screen.getByRole("button", { name: "Заведение" }));
    const sheet = screen.getByRole("dialog");
    expect(within(sheet).queryByRole("searchbox")).not.toBeInTheDocument();

    await userEvent.click(await within(sheet).findByRole("button", { name: "Coffeeroom" }));
    expect(onFiltersChange).toHaveBeenCalledWith({ venueId: 7 });
  });

  it("one buyer's orders (from an order's link): a pill with ×, each row's number", async () => {
    let query: URLSearchParams | undefined;
    filterLists();
    server.use(
      http.get(api("/admin/orders"), ({ request }) => {
        query = new URL(request.url).searchParams;
        return HttpResponse.json({ items: [order(1)], nextCursor: null });
      })
    );
    const onFiltersChange = vi.fn();
    renderWithProviders(<OrderList search="" filters={{ ...NO_FILTERS, userId: 42 }} onFiltersChange={onFiltersChange} />);

    expect(await screen.findByText("№11111111")).toBeInTheDocument();
    expect(query?.get("userId")).toBe("42");

    await userEvent.click(screen.getByRole("button", { name: "Покупатель: ID 42: сбросить" }));
    expect(onFiltersChange).toHaveBeenCalledWith({ userId: null });
  });
});
