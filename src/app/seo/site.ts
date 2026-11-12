import { SITE_DEFAULT_LANGUAGE, SITE_LANG_PARAM } from "@shared/constants";

export const SEO_LANGUAGES = ["ru", "kg", "en"] as const;
export type SeoLanguage = (typeof SEO_LANGUAGES)[number];

// Our "kg" is ISO 639-1 "ky" for search engines and social cards.
export const HREFLANG: Record<SeoLanguage, string> = { ru: "ru", kg: "ky", en: "en" };
export const OG_LOCALE: Record<SeoLanguage, string> = { ru: "ru_RU", kg: "ky_KG", en: "en_US" };

// The pre-rendered pages: one per public address and language. `file` is
// where the build puts it under dist/ - vercel.json rewrites the public
// address there by ?lang (a file at the public path itself would be served
// for every ?lang: Vercel checks files before rewrites).
export interface SeoPage {
  path: string;
  file: (lang: SeoLanguage) => string;
}

export const SEO_DIR = "_seo";

export const pageFile = (lang: SeoLanguage, name: string) => `${SEO_DIR}/${lang}/${name}.html`;

export const STATIC_PAGES = {
  home: { path: "/", file: (lang: SeoLanguage) => pageFile(lang, "index") },
  about: { path: "/about", file: (lang: SeoLanguage) => pageFile(lang, "about") },
  offer: { path: "/offer", file: (lang: SeoLanguage) => pageFile(lang, "offer") },
  privacy: { path: "/privacy", file: (lang: SeoLanguage) => pageFile(lang, "privacy") },
  faq: { path: "/faq", file: (lang: SeoLanguage) => pageFile(lang, "faq") }
} satisfies Record<string, SeoPage>;

export const venuePage = (slug: string): SeoPage => ({
  path: `/venues/${slug}`,
  file: (lang) => pageFile(lang, `venues/${slug}`)
});

// The app's shell for every other address (/app/*, /orders/*, /gift/*) and
// for a venue added after the build (404.html - the app finds it itself).
export const APP_SHELL_FILE = `${SEO_DIR}/app.html`;

// The address of a page in a language: Russian without a parameter.
export const pageUrl = (siteUrl: string, path: string, lang: SeoLanguage) =>
  `${siteUrl}${path}` + (lang === SITE_DEFAULT_LANGUAGE ? "" : `?${SITE_LANG_PARAM}=${lang}`);
