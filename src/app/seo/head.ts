import { HREFLANG, OG_LOCALE, pageUrl, SEO_LANGUAGES, type SeoLanguage } from "./site";

export interface PageMeta {
  lang: SeoLanguage;
  path: string;
  title: string;
  description: string;
  image: string;
  jsonLd: object[];
}

const escape = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// JSON inside <script>: "</script>" in a venue's text must not end the tag.
const json = (data: object) => JSON.stringify(data).replace(/</g, "\\u003c");

// One version per language, each canonical to itself; all three plus
// x-default (Russian) listed on every version.
export const renderHead = (siteUrl: string, meta: PageMeta) => {
  const url = pageUrl(siteUrl, meta.path, meta.lang);
  const tags = [
    `<title>${escape(meta.title)}</title>`,
    `<meta name="description" content="${escape(meta.description)}" />`,
    `<link rel="canonical" href="${escape(url)}" />`,
    ...SEO_LANGUAGES.map(
      (lang) => `<link rel="alternate" hreflang="${HREFLANG[lang]}" href="${escape(pageUrl(siteUrl, meta.path, lang))}" />`
    ),
    `<link rel="alternate" hreflang="x-default" href="${escape(pageUrl(siteUrl, meta.path, "ru"))}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="KuttukTime" />`,
    `<meta property="og:title" content="${escape(meta.title)}" />`,
    `<meta property="og:description" content="${escape(meta.description)}" />`,
    `<meta property="og:url" content="${escape(url)}" />`,
    `<meta property="og:image" content="${escape(meta.image)}" />`,
    `<meta property="og:locale" content="${OG_LOCALE[meta.lang]}" />`,
    ...SEO_LANGUAGES.filter((lang) => lang !== meta.lang).map(
      (lang) => `<meta property="og:locale:alternate" content="${OG_LOCALE[lang]}" />`
    ),
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escape(meta.title)}" />`,
    `<meta name="twitter:description" content="${escape(meta.description)}" />`,
    `<meta name="twitter:image" content="${escape(meta.image)}" />`,
    ...meta.jsonLd.map((data) => `<script type="application/ld+json">${json(data)}</script>`)
  ];

  return tags.join("\n    ");
};

// The built index.html with a page's language, head and pre-rendered body.
// #seo shows until the app is ready (then the app removes it); in Telegram
// the inline script in index.html hides it at once.
export const fillShell = (shell: string, lang: SeoLanguage, head: string, body: string) =>
  shell
    .replace(/<html lang="[^"]*">/, `<html lang="${HREFLANG[lang]}">`)
    .replace(/<title>[^<]*<\/title>/, head)
    .replace(`<div id="root"></div>`, `<div id="seo">${body}</div>\n    <div id="root"></div>`);
