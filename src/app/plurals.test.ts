import { describe, expect, it } from "vitest";

import i18n from "./configs/i18n";

const validity = (lng: string, count: number) => i18n.t("venue.validity", { lng, count });

describe("months are declined", () => {
  it.each([
    [1, "Действует 1 месяц"],
    [3, "Действует 3 месяца"],
    [5, "Действует 5 месяцев"],
    [12, "Действует 12 месяцев"],
    [21, "Действует 21 месяц"]
  ])("ru %i", (count, text) => {
    expect(validity("ru", count)).toBe(text);
  });

  it.each([
    [1, "Valid for 1 month"],
    [3, "Valid for 3 months"]
  ])("en %i", (count, text) => {
    expect(validity("en", count)).toBe(text);
  });

  it.each([1, 3, 12])("kg %i - «ай» never changes", (count) => {
    expect(validity("kg", count)).toBe(`${count} ай жарактуу`);
  });

  it("the admin's venue card too", () => {
    expect(i18n.t("admin.venues.detail.validityValue", { lng: "ru", count: 3 })).toBe("3 месяца");
  });
});
