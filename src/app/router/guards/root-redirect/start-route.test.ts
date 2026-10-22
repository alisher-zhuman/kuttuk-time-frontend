import { describe, expect, it } from "vitest";

import { getStartRoute } from "./start-route";

const ORDER = "22222222-2222-4222-8222-222222222222";

describe("getStartRoute — where a launch lands", () => {
  it("opens the order on startapp=order_<uuid>, for any role (back from Finik)", () => {
    expect(getStartRoute(`order_${ORDER}`, "user")).toBe(`/app/orders/${ORDER}`);
    expect(getStartRoute(`order_${ORDER}`, "merchant")).toBe(`/app/orders/${ORDER}`);
    expect(getStartRoute(`order_${ORDER}`, "admin")).toBe(`/app/orders/${ORDER}`);
  });

  it("opens a buyer's venue deep link by slug or id", () => {
    expect(getStartRoute("coffeeroom", "user")).toBe("/app/venues/coffeeroom");
    expect(getStartRoute("1", "user")).toBe("/app/venues/1");
  });

  it("sends the admin and the owner to their own home, deep link or not", () => {
    expect(getStartRoute("coffeeroom", "admin")).toBe("/app/admin/venues");
    expect(getStartRoute(undefined, "merchant")).toBe("/app/merchant");
  });

  it("opens the catalog without a start param", () => {
    expect(getStartRoute(undefined, "user")).toBe("/app");
  });
});
