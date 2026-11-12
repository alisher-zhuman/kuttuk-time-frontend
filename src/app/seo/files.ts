import { type PublicCatalog } from "./catalog";
import { HREFLANG, pageUrl, SEO_LANGUAGES, STATIC_PAGES, venuePage } from "./site";

interface SitemapEntry {
  path: string;
  lastmod?: string;
}

const day = (iso: string) => iso.slice(0, 10);

// Every public page in every language, each listing its alternates.
export const renderSitemap = (siteUrl: string, catalog: PublicCatalog) => {
  const newest = catalog.venues.map((venue) => venue.updatedAt).sort().at(-1);
  const entries: SitemapEntry[] = [
    { path: STATIC_PAGES.home.path, ...(newest && { lastmod: day(newest) }) },
    ...catalog.venues.map((venue) => ({ path: venuePage(venue.slug).path, lastmod: day(venue.updatedAt) })),
    { path: STATIC_PAGES.faq.path },
    { path: STATIC_PAGES.about.path },
    { path: STATIC_PAGES.offer.path },
    { path: STATIC_PAGES.privacy.path }
  ];

  const urls = entries.flatMap((entry) =>
    SEO_LANGUAGES.map((lang) =>
      [
        "  <url>",
        `    <loc>${pageUrl(siteUrl, entry.path, lang).replace(/&/g, "&amp;")}</loc>`,
        ...(entry.lastmod ? [`    <lastmod>${entry.lastmod}</lastmod>`] : []),
        ...SEO_LANGUAGES.map(
          (alt) => `    <xhtml:link rel="alternate" hreflang="${HREFLANG[alt]}" href="${pageUrl(siteUrl, entry.path, alt)}" />`
        ),
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${pageUrl(siteUrl, entry.path, "ru")}" />`,
        "  </url>"
      ].join("\n")
    )
  );

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`,
    ...urls,
    `</urlset>`,
    ""
  ].join("\n");
};

// Closed: the Mini App (cabinet /app/merchant, admin /app/admin, profile,
// orders, certificates, gifts), the payment return /orders/<id>, gift links
// /gift/<token>, and the pre-rendered files' own folder (served only through
// the public addresses).
export const renderRobots = (siteUrl: string) =>
  ["User-agent: *", "Disallow: /app", "Disallow: /orders/", "Disallow: /gift/", "Disallow: /_seo/", "", `Sitemap: ${siteUrl}/sitemap.xml`, ""].join("\n");

// llmstxt.org: what this is, how it works, where to read more.
export const renderLlms = (siteUrl: string, catalog: PublicCatalog) => {
  const venues = catalog.venues.map(
    (venue) => `- [${venue.name}](${pageUrl(siteUrl, venuePage(venue.slug).path, "ru")}): ${venue.description.ru}`
  );

  return [
    "# KuttukTime",
    "",
    "> Подарочные сертификаты местных заведений Кыргызстана: кофеен, ресторанов и других. Gift certificates for local places in Kyrgyzstan.",
    "",
    "## Как это работает",
    "",
    "1. Выберите заведение и сумму, оплатите онлайн через Finik (вход через Telegram, номер телефона не нужен).",
    "2. Сразу получите код и QR-код - используйте сами или подарите другу ссылкой.",
    "3. Покажите код или QR-код в заведении. Сертификат используется за один раз на всю сумму и действует до даты, указанной на нём.",
    "",
    "## Как это работает (кыргызча)",
    "",
    "Мекемени жана сумманы тандап, онлайн төлөңүз - код жана QR-код ошол замат келет. Аны өзүңүз колдонуңуз же досуңузга белек кылыңыз.",
    "",
    "## How it works (English)",
    "",
    "Pick a place and an amount, pay online - get a code and a QR code at once. Use it yourself or gift it to a friend by a link. Show the code at the place.",
    "",
    "## Страницы",
    "",
    `- [Каталог заведений](${siteUrl}/): все заведения и номиналы`,
    `- [Как это работает - вопросы и ответы](${siteUrl}/faq): покупка, подарок, использование, срок, возврат`,
    `- [О нас](${siteUrl}/about): кто мы, поддержка`,
    `- [Публичная оферта](${siteUrl}/offer): покупка, использование, возврат`,
    `- [Политика конфиденциальности](${siteUrl}/privacy)`,
    "- Поддержка: Telegram @alisher_zh",
    "",
    "Каждая страница есть на трёх языках: без параметра - русский, ?lang=kg - кыргызский, ?lang=en - английский.",
    "",
    "## Заведения",
    "",
    ...venues,
    ""
  ].join("\n");
};
