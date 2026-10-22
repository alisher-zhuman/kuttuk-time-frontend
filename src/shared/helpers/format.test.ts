import { describe, expect, it } from "vitest";

import { formatDate, formatDateTime, formatIsoDate, formatMoney, shiftIsoDate } from "./index";

describe("formatMoney", () => {
  it("groups thousands with a non-breaking space and adds the currency", () => {
    expect(formatMoney(1000, "сом").replace(/\s/g, " ")).toBe("1 000 сом");
    expect(formatMoney(500, "сом")).toBe("500 сом");
  });
});

describe("dates are Bishkek time, whatever the device zone", () => {
  it("shows 20:30Z on 21.10 as 22.10, 02:30 in Bishkek (UTC+6)", () => {
    expect(formatDateTime("2026-10-21T20:30:00.000Z")).toBe("22.10.2026, 02:30");
    expect(formatDate("2026-10-21T20:30:00.000Z")).toBe("22.10.2026");
  });

  it("handles a YYYY-MM-DD week date as a string — no local-zone shift", () => {
    expect(formatIsoDate("2026-10-19")).toBe("19.10.2026");
    expect(shiftIsoDate("2026-10-19", -7)).toBe("2026-10-12");
    expect(shiftIsoDate("2026-12-28", 7)).toBe("2027-01-04");
  });
});
