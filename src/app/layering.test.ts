import { describe, expect, it } from "vitest";

import { enCommon, kgCommon, ruCommon } from "@shared/locales";

// Rules from CLAUDE.md that steiger doesn't check — a machine catches them on
// every push, not a reader.

const SOURCES: Record<string, string> = import.meta.glob(
  ["/src/**/*.{ts,tsx}", "!/src/**/*.test.{ts,tsx}"],
  { query: "?raw", import: "default", eager: true }
);

const FILES = Object.keys(SOURCES);

const withoutComments = (source: string) =>
  source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");

describe("a page is the route and nothing else", () => {
  it("holds only index.tsx — no hooks / helpers / model / ui of its own", () => {
    const strays = FILES.filter((path) => path.startsWith("/src/pages/")).filter(
      (path) => !path.endsWith("/index.tsx")
    );

    expect(strays).toEqual([]);
  });
});

describe("an entity's public index.ts only re-exports", () => {
  it("has export statements and nothing else", () => {
    const offenders = FILES.filter((path) => /^\/src\/entities\/[^/]+\/index\.ts$/.test(path)).filter(
      (path) =>
        withoutComments(SOURCES[path] ?? "")
          .split("\n")
          .some((line) => /^[A-Za-z]/.test(line) && !line.startsWith("export"))
    );

    expect(offenders).toEqual([]);
  });
});

describe("locales", () => {
  const flatten = (value: unknown, prefix = ""): string[] =>
    typeof value === "object" && value !== null
      ? Object.entries(value).flatMap(([key, nested]) => flatten(nested, `${prefix}${key}.`))
      : [prefix.slice(0, -1)];

  const ru = flatten(ruCommon);

  // A key missing in one locale renders as its own name.
  it.each([
    ["kg", kgCommon],
    ["en", enCommon]
  ])("%s has exactly the ru keys", (_, locale) => {
    const keys = flatten(locale);

    expect(ru.filter((key) => !keys.includes(key))).toEqual([]);
    expect(keys.filter((key) => !ru.includes(key))).toEqual([]);
  });

  // «мерчант» only in en; ru / kg say «заведение» / «владелец».
  it.each([
    ["ru", ruCommon],
    ["kg", kgCommon]
  ])("%s never says «мерчант»", (_, locale) => {
    expect(JSON.stringify(locale)).not.toMatch(/мерчант/i);
  });
});

describe("one way to do it", () => {
  const usesOutside = (pattern: RegExp, allowed: string) =>
    FILES.filter((path) => path !== allowed && pattern.test(withoutComments(SOURCES[path] ?? "")));

  it("navigates only through useNavigateTo", () => {
    expect(usesOutside(/\buseNavigate\(/, "/src/shared/hooks/useNavigateTo.ts")).toEqual([]);
  });

  it("reads launch params only through getLaunchParams", () => {
    expect(usesOutside(/\bretrieveLaunchParams\(/, "/src/shared/helpers/tma.ts")).toEqual([]);
  });
});
