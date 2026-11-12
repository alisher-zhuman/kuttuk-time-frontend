import { describe, expect, it } from "vitest";

import { toSitePath, withSiteLanguage } from "./site";

describe("the website's public addresses", () => {
  it.each([
    ["/app", "/"],
    ["/app/venues/sierra", "/venues/sierra"],
    ["/app/about", "/about"],
    ["/app/offer", "/offer"],
    ["/app/privacy", "/privacy"],
    // Not public pages - stay under /app.
    ["/app/profile", "/app/profile"],
    ["/app/orders/o-1", "/app/orders/o-1"],
    ["/orders/o-1", "/orders/o-1"],
    ["/gift/t-1", "/gift/t-1"]
  ])("%s → %s", (from, to) => {
    expect(toSitePath(from)).toBe(to);
  });

  it("keeps the language in ?lang; Russian - no parameter", () => {
    expect(withSiteLanguage("/venues/sierra", "kg")).toBe("/venues/sierra?lang=kg");
    expect(withSiteLanguage("/venues/sierra?lang=kg", "ru")).toBe("/venues/sierra");
    expect(withSiteLanguage("/?category=2", "en")).toBe("/?category=2&lang=en");
  });
});
