import { fixtures } from "@mocks";
import { describe, expect, it } from "vitest";

import { VenueOptionsSchema } from "./schemas";

describe("VenueOptionsSchema — GET /venues/options", () => {
  it("parses the allowed values with nameMaxLength", () => {
    expect(VenueOptionsSchema.parse(fixtures.venueOptions).nameMaxLength).toBe(100);
  });

  it("requires nameMaxLength — forms validate the name against it", () => {
    const { nameMaxLength: _, ...withoutLimit } = fixtures.venueOptions;

    expect(VenueOptionsSchema.safeParse(withoutLimit).success).toBe(false);
  });
});
