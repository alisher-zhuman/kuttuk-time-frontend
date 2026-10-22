import { describe, expect, it } from "vitest";

// CLAUDE.md: in components, local state (useState) is declared before other
// hooks. A test rather than a note — it runs on every push.

// Components only (.tsx): a hook's own order is dictated by its job.
const SOURCES = import.meta.glob(["/src/**/*.tsx", "!/src/**/*.test.tsx"], {
  query: "?raw",
  import: "default",
  eager: true
});

// Comments and imports first, or "useState" in prose and imports would count.
const withoutNoise = (source: string) =>
  source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "")
    .split("\n")
    .filter((line) => !line.trimStart().startsWith("import"))
    .join("\n");

// `[(<]` — useState( and useState<T>( are the same call.
const HOOK_CALL = /\buse[A-Z]\w*\s*[(<]/g;

const hooksOf = (source: string) =>
  [...withoutNoise(source).matchAll(HOOK_CALL)].map((match) => match[0].replace(/\s*[(<]$/, ""));

// Every useState comes before any other hook — the whole order, not just the
// first call (a second useState below useTranslation breaks the rule too).
const isDisplaced = (hooks: string[]) => {
  const firstOther = hooks.findIndex((hook) => hook !== "useState");

  return firstOther !== -1 && hooks.slice(firstOther).includes("useState");
};

describe("useState comes first in components", () => {
  it("holds across the project", () => {
    const offenders = Object.entries(SOURCES)
      .map(([path, source]) => [path, hooksOf(source as string)] as const)
      .filter(([, hooks]) => isDisplaced(hooks))
      .map(([path, hooks]) => `${path} → ${hooks.slice(0, 5).join(" · ")}`);

    expect(offenders).toEqual([]);
  });

  it("checks the whole order, not only the first hook", () => {
    expect(isDisplaced(["useState", "useTranslation", "useState"])).toBe(true);
    expect(isDisplaced(["useState", "useState", "useTranslation"])).toBe(false);
    expect(isDisplaced(["useTranslation", "useNavigateTo"])).toBe(false);
  });

  it("sees a typed call and ignores comments and imports", () => {
    expect(hooksOf("const [a] = useState<string[]>([])")).toEqual(["useState"]);
    expect(hooksOf('import { useState } from "react"')).toEqual([]);
    expect(hooksOf("// useTranslation() first\nconst [a] = useState(0)")).toEqual(["useState"]);
  });
});
