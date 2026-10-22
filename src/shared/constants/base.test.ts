import { describe, expect, it } from "vitest";

import { BOT_URL, getVenueShareLink } from "./base";

describe("getVenueShareLink", () => {
  it("opens the bot's Mini App with the slug as startapp", () => {
    const link = getVenueShareLink("coffeeroom");

    expect(link).toBe("https://t.me/kuttuk_time_bot/app?startapp=coffeeroom");
    expect(link.startsWith(`${BOT_URL}/app?`)).toBe(true);
    expect(new URL(link).searchParams.get("startapp")).toBe("coffeeroom");
  });

  it("keeps a hyphenated slug whole", () => {
    expect(new URL(getVenueShareLink("sierra-coffee")).searchParams.get("startapp")).toBe("sierra-coffee");
  });

  it("is never the short koyeb link", () => {
    expect(getVenueShareLink("coffeeroom")).not.toContain("koyeb");
  });
});
