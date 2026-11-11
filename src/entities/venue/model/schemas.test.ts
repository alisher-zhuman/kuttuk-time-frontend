import { fixtures } from "@mocks";
import { describe, expect, it } from "vitest";

import { VenueDetailSchema, VenueOptionsSchema } from "./schemas";

describe("VenueOptionsSchema - GET /venues/options", () => {
  it("parses the allowed values with nameMaxLength", () => {
    expect(VenueOptionsSchema.parse(fixtures.venueOptions).nameMaxLength).toBe(100);
  });

  it("requires nameMaxLength - forms validate the name against it", () => {
    const { nameMaxLength: _, ...withoutLimit } = fixtures.venueOptions;

    expect(VenueOptionsSchema.safeParse(withoutLimit).success).toBe(false);
  });
});

describe("VenueDetailSchema - GET /venues/:idOrSlug", () => {
  const venue = {
    id: 1,
    name: "Coffeeroom",
    description: "Кофейня",
    logo: "https://res.cloudinary.com/demo/image/upload/v1/logo.png",
    nominals: [500],
    validityMonths: 12,
    address: "ул. Киевская 95",
    mapUrl: "https://go.2gis.com/abc"
  };

  it("requires where the venue is", () => {
    expect(VenueDetailSchema.safeParse(venue).success).toBe(true);
    expect(VenueDetailSchema.safeParse({ ...venue, address: null }).success).toBe(false);
    expect(VenueDetailSchema.safeParse({ ...venue, mapUrl: null }).success).toBe(false);
  });
});
