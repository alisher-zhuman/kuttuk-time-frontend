import { describe, expect, it } from "vitest";

import { getAboutText, LEGAL_TEXTS } from "./index";

// The backend's originals when it sits next to this repo (locally); none in CI.
const BACKEND: Record<string, string> = import.meta.glob(["../../../../backend/docs/legal/*.md", "!**/README.md"], {
  query: "?raw",
  import: "default",
  eager: true
});

const backendText = (name: string) =>
  Object.entries(BACKEND).find(([path]) => path.endsWith(`/${name}`))?.[1];

describe("the legal texts", () => {
  it.skipIf(Object.keys(BACKEND).length === 0)("are the backend's, unchanged", () => {
    expect(LEGAL_TEXTS.about).toBe(backendText("about.md"));
    expect(LEGAL_TEXTS.offer).toBe(backendText("offer.ru.md"));
    expect(LEGAL_TEXTS.privacy).toBe(backendText("privacy.ru.md"));
  });

  it("«О нас» per language", () => {
    expect(getAboutText("ru")).toMatch(/^\*\*KuttukTime\*\* - подарочные сертификаты/);
    expect(getAboutText("kg")).toMatch(/^\*\*KuttukTime\*\* - Кыргызстандагы/);
    expect(getAboutText("en")).toMatch(/^\*\*KuttukTime\*\* - gift certificates/);
    expect(getAboutText("ru")).not.toContain("## kg");
  });
});
