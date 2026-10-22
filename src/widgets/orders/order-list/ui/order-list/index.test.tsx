import { api, fixtures, server } from "@mocks";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests";
import { http, HttpResponse } from "msw";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

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

    renderWithProviders(<OrderList status={null} onStatusChange={() => {}} search="" />);

    const retry = await screen.findByRole("button", { name: "Повторить" }, { timeout: 4000 });
    expect(screen.getByText("Venue 1")).toBeInTheDocument();
    expect(screen.getByText("Venue 2")).toBeInTheDocument();
    expect(screen.queryByText("Не удалось загрузить данные")).not.toBeInTheDocument();

    await userEvent.click(retry);

    expect(await screen.findByText("Venue 3")).toBeInTheDocument();
    expect(screen.getByText("Venue 1")).toBeInTheDocument();
  });
});
