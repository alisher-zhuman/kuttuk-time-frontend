/// <reference types="node" />
// The website's pages for search engines and AI crawlers - run by `pnpm build`
// after the app's own build (vite build --ssr of this file, then node):
// fetches the public catalog once, writes every public page in every language
// into dist/_seo/, plus sitemap.xml, robots.txt, llms.txt; the app's shell
// moves to dist/_seo/app.html (vercel.json rewrites to all of them).
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

import { EMPTY_CATALOG, type PublicCatalog, PublicCatalogSchema, renderSite } from "./index";

const DIST = "dist";
const ATTEMPTS = 3;
// Koyeb and the database sleep: the first request can take 10-30 s.
const ATTEMPT_TIMEOUT_MS = 60_000;

const apiUrl = process.env["VITE_API_URL"];
const siteUrl = (process.env["VITE_SITE_URL"] || "https://kuttuk-time.vercel.app").replace(/\/$/, "");
const isProduction = process.env["VERCEL_ENV"] === "production";

const fetchCatalog = async (): Promise<PublicCatalog> => {
  let lastError: unknown;

  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    try {
      const response = await fetch(`${apiUrl}/public/catalog`, { signal: AbortSignal.timeout(ATTEMPT_TIMEOUT_MS) });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      return PublicCatalogSchema.parse(await response.json());
    } catch (error) {
      lastError = error;
      console.warn(`seo: the catalog, attempt ${attempt}/${ATTEMPTS} failed:`, error);
    }
  }

  throw lastError;
};

const loadCatalog = async () => {
  try {
    return await fetchCatalog();
  } catch (error) {
    // Production must not go out without its venues' pages; a preview, CI or
    // a local build (a fake API) goes on with the rest.
    if (isProduction) throw error;

    console.warn("seo: no catalog - the venues' pages are skipped (not a production build)");

    return EMPTY_CATALOG;
  }
};

const catalog = await loadCatalog();
const shell = await readFile(join(DIST, "index.html"), "utf8");

const files = renderSite({ catalog, siteUrl, shell });

for (const [path, content] of Object.entries(files)) {
  const target = join(DIST, path);

  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, content);
}

// "/" must reach the rewrites (by ?lang), not this file: Vercel serves a file
// before any rewrite.
await rm(join(DIST, "index.html"));

console.warn(`seo: ${Object.keys(files).length} files for ${catalog.venues.length} venues, ${siteUrl}`);
