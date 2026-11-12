import { describe, expect, it } from "vitest";

import vercel from "../../../vercel.json";
import { renderSite } from "./index";

const SITE = "https://kuttuk.test";
const SHELL = `<!doctype html>
<html lang="en">
  <head>
    <title>KuttukTime</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;

const catalog = {
  venues: [
    {
      id: 9,
      slug: "sierra-coffee",
      name: "Sierra Coffee",
      description: { ru: "Кофейня </script><b>", kg: "Кофейня", en: "Coffee shop" },
      logo: "https://res.cloudinary.com/x/image/upload/v1/kuttuk-time/abc.webp",
      categories: [1],
      nominals: [500, 1000, 2000],
      validityMonths: 12,
      address: "г. Бишкек, ул. Киевская 1",
      mapUrl: "https://2gis.kg/bishkek/search/Sierra",
      updatedAt: "2026-11-12T06:00:00.000Z"
    }
  ],
  categories: [{ id: 1, name: { ru: "Кофейни", kg: "Кофейнялар", en: "Coffee" }, order: 0 }]
};

const files = renderSite({ catalog, siteUrl: SITE, shell: SHELL });

const jsonLd = (html: string) =>
  [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map((match) => JSON.parse(match[1]!) as Record<string, unknown>);

describe("the website's pre-rendered pages", () => {
  it("a venue in Kyrgyz: its own language, canonical to itself, every version in hreflang", () => {
    const html = files["_seo/kg/venues/sierra-coffee.html"]!;

    expect(html).toContain(`<html lang="ky">`);
    expect(html).toContain(`<link rel="canonical" href="${SITE}/venues/sierra-coffee?lang=kg" />`);
    expect(html).toContain(`hreflang="ru" href="${SITE}/venues/sierra-coffee"`);
    expect(html).toContain(`hreflang="en" href="${SITE}/venues/sierra-coffee?lang=en"`);
    expect(html).toContain(`hreflang="x-default" href="${SITE}/venues/sierra-coffee"`);
    expect(html).toContain(`<title>Sierra Coffee - белек сертификаты - KuttukTime</title>`);
    // The app still mounts after the page.
    expect(html).toMatch(/<div id="seo">.*<\/div>\s*<div id="root"><\/div>/s);
  });

  it("LocalBusiness with an Offer in KGS per nominal; the logo as the social card", () => {
    const html = files["_seo/ru/venues/sierra-coffee.html"]!;
    const [business] = jsonLd(html);

    expect(business).toMatchObject({ "@type": "LocalBusiness", name: "Sierra Coffee", hasMap: catalog.venues[0]!.mapUrl, url: `${SITE}/venues/sierra-coffee` });
    expect(business!["makesOffer"]).toEqual(
      [500, 1000, 2000].map((price): unknown => expect.objectContaining({ "@type": "Offer", price, priceCurrency: "KGS" }))
    );
    expect(html).toContain(`og:image" content="https://res.cloudinary.com/x/image/upload/c_pad,w_1200,h_630,b_white,f_jpg/v1/kuttuk-time/abc.webp"`);
  });

  it("a venue's text can't break out of its tags", () => {
    const html = files["_seo/ru/venues/sierra-coffee.html"]!;

    expect(html).not.toContain("Кофейня </script>");
    expect(html).not.toContain("<b>");
  });

  it("the home page: Organization, links to each venue in the page's language", () => {
    const html = files["_seo/en/index.html"]!;

    expect(jsonLd(html)[0]).toMatchObject({ "@type": "Organization", name: "KuttukTime" });
    expect(html).toContain(`href="${SITE}/venues/sierra-coffee?lang=en"`);
  });

  it("sitemap.xml: every page in every language with its alternates; robots.txt closes the private parts", () => {
    const sitemap = files["sitemap.xml"]!;

    expect(sitemap.match(/<url>/g)).toHaveLength(5 * 3);
    expect(sitemap).toContain(`<loc>${SITE}/venues/sierra-coffee?lang=kg</loc>`);
    expect(sitemap).toContain("<lastmod>2026-11-12</lastmod>");
    expect(files["robots.txt"]).toContain("Disallow: /app\n");
    expect(files["robots.txt"]).toContain(`Sitemap: ${SITE}/sitemap.xml`);
  });

  it("vercel.json serves each page's file by its public address and ?lang; an unknown venue is a 404", () => {
    const exists = (dest: string) => dest === "/404.html" || files[dest.slice(1)] !== undefined;
    // Vercel's order: the first matching rewrite whose `has` holds and whose
    // file exists (a missing one falls through to the next rule); none - 404.
    const serve = (path: string, lang?: string) => {
      for (const rule of vercel.rewrites) {
        const names: string[] = [];
        const pattern = rule.source.replace(/:(\w+)(\([^)]*\))?/g, (_, name: string, group?: string) => {
          names.push(name);
          return group ?? "([^/]+)";
        });
        const match = new RegExp(`^${pattern}$`).exec(path);
        const has = "has" in rule ? rule.has : [];

        if (match && has.every((condition) => condition.value === lang)) {
          const dest = names.reduce((to, name, index) => to.replace(`:${name}`, match[index + 1]!), rule.destination);

          if (exists(dest)) return dest;
        }
      }

      return "404";
    };

    for (const lang of ["ru", "kg", "en"]) {
      const query = lang === "ru" ? undefined : lang;

      expect(serve("/", query)).toBe(`/_seo/${lang}/index.html`);
      expect(serve("/venues/sierra-coffee", query)).toBe(`/_seo/${lang}/venues/sierra-coffee.html`);
      expect(serve("/about", query)).toBe(`/_seo/${lang}/about.html`);
      // Not an empty shell with 200 for search engines - 404.html (the app).
      expect(serve("/venues/no-such-venue", query)).toBe("404");
    }

    // Everything else - the app, as before.
    expect(serve("/orders/o-1")).toBe("/_seo/app.html");
    expect(serve("/gift/t-1")).toBe("/_seo/app.html");
    expect(serve("/app/merchant")).toBe("/_seo/app.html");
    expect(files["_seo/app.html"]).toBe(SHELL);
    expect(files["404.html"]).toBe(SHELL);
  });

  it("the pre-rendered files' own addresses are noindex - only the public ones are indexed", () => {
    expect(vercel.headers).toContainEqual({ source: "/_seo/(.*)", headers: [{ key: "X-Robots-Tag", value: "noindex" }] });
  });
});
