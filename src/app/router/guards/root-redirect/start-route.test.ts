import { describe, expect, it } from "vitest";

import { getVenueShareLink } from "@shared/constants";

import { getStartRoute } from "./start-route";

const ORDER = "22222222-2222-4222-8222-222222222222";

describe("getStartRoute - where a launch lands", () => {
  it("opens the order on startapp=order_<uuid>, for any role (back from Finik)", () => {
    expect(getStartRoute(`order_${ORDER}`, "user")).toBe(`/app/orders/${ORDER}`);
    expect(getStartRoute(`order_${ORDER}`, "merchant")).toBe(`/app/orders/${ORDER}`);
    expect(getStartRoute(`order_${ORDER}`, "admin")).toBe(`/app/orders/${ORDER}`);
  });

  it("opens a buyer's venue deep link by slug or id", () => {
    expect(getStartRoute("coffeeroom", "user")).toBe("/app/venues/coffeeroom");
    expect(getStartRoute("1", "user")).toBe("/app/venues/1");
  });

  it("opens the venue from its share link", () => {
    const startParam = new URL(getVenueShareLink("sierra-coffee")).searchParams.get("startapp") ?? undefined;

    expect(getStartRoute(startParam, "user")).toBe("/app/venues/sierra-coffee");
  });

  it("opens «Забрать подарок» on startapp=gift_<token>, for any role", () => {
    const token = "aB3_dE6-gH9iJ2kL5mN8oP";

    expect(getStartRoute(`gift_${token}`, "user")).toBe(`/app/gifts/${token}`);
    expect(getStartRoute(`gift_${token}`, "merchant")).toBe(`/app/gifts/${token}`);
    expect(getStartRoute(`gift_${token}`, "admin")).toBe(`/app/gifts/${token}`);
  });

  it("opens «Мои сертификаты» on startapp=my_certificates, for any role", () => {
    expect(getStartRoute("my_certificates", "user")).toBe("/app/profile");
    expect(getStartRoute("my_certificates", "merchant")).toBe("/app/profile");
    expect(getStartRoute("my_certificates", "admin")).toBe("/app/profile");
  });

  it("reads a slug that only starts like a prefix as a venue", () => {
    expect(getStartRoute("giftshop", "user")).toBe("/app/venues/giftshop");
    expect(getStartRoute("orderly", "user")).toBe("/app/venues/orderly");
  });

  it("opens a venue link on the storefront for the owner and the admin too", () => {
    expect(getStartRoute("coffeeroom", "merchant")).toBe("/app/venues/coffeeroom");
    expect(getStartRoute("coffeeroom", "admin")).toBe("/app/venues/coffeeroom");
  });

  it("sends the admin and the owner to their own home without a link", () => {
    expect(getStartRoute(undefined, "admin")).toBe("/app/admin/venues");
    expect(getStartRoute(undefined, "merchant")).toBe("/app/merchant");
  });

  it("opens the catalog without a start param", () => {
    expect(getStartRoute(undefined, "user")).toBe("/app");
  });
});
