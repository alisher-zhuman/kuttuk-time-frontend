import { describe, expect, it } from "vitest";

import { resolveLang } from "./i18n";

describe("resolveLang", () => {
  it("keeps a supported language", () => {
    expect(resolveLang("ru")).toBe("ru");
    expect(resolveLang("en")).toBe("en");
  });

  it("falls back to kg for anything else (a browser en-US, a stale value)", () => {
    expect(resolveLang("en-US")).toBe("kg");
    expect(resolveLang("")).toBe("kg");
  });
});
