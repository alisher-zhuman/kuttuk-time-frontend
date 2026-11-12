import { type ReactElement } from "react";
import { renderToString } from "react-dom/server";

import { FaqList, getFaqItems } from "@widgets/faq";

import { formatMoney } from "@shared/helpers";
import { getAboutText, LEGAL_TEXTS } from "@shared/legal";

import { type PublicCatalog } from "./catalog";
import { renderLlms, renderRobots, renderSitemap } from "./files";
import { fillShell, type PageMeta, renderHead } from "./head";
import { createSeoT } from "./i18n";
import { faqLd, organizationLd, venueLd } from "./json-ld";
import {
  APP_SHELL_FILE,
  pageUrl,
  SEO_LANGUAGES,
  type SeoPage,
  STATIC_PAGES,
  venuePage
} from "./site";
import { CatalogPage } from "./templates/catalog-page";
import { LegalPage } from "./templates/legal-page";
import { SiteLayout } from "./templates/site-layout";
import { VenuePage } from "./templates/venue-page";

export { EMPTY_CATALOG,type PublicCatalog, PublicCatalogSchema } from "./catalog";

interface Input {
  catalog: PublicCatalog;
  siteUrl: string;
  // The built index.html - the app's shell every page is put into.
  shell: string;
}

const DESCRIPTION_LENGTH = 160;

const clip = (text: string) =>
  text.length <= DESCRIPTION_LENGTH ? text : `${text.slice(0, DESCRIPTION_LENGTH - 1).replace(/\s+\S*$/, "")}…`;

// A square card for social previews: the logo padded to 1200x630 (Cloudinary
// does it on the fly); another host's logo goes as it is.
const ogImage = (logo: string) =>
  logo.includes("res.cloudinary.com") && logo.includes("/upload/")
    ? logo.replace("/upload/", "/upload/c_pad,w_1200,h_630,b_white,f_jpg/")
    : logo;

// Every public page in every language, plus sitemap.xml, robots.txt, llms.txt
// and the app's shell: { "path under dist/": "content" }.
// eslint-disable-next-line react-refresh/only-export-components -- build-time only, never hot-reloaded
export const renderSite = ({ catalog, siteUrl, shell }: Input): Record<string, string> => {
  const files: Record<string, string> = {};

  for (const lang of SEO_LANGUAGES) {
    const t = createSeoT(lang);
    const money = (amount: number) => formatMoney(amount, t("certificate.currency"));

    const page = (seoPage: SeoPage, meta: Omit<PageMeta, "lang" | "path">, content: ReactElement, wide = false) => {
      const body = renderToString(
        <SiteLayout t={t} lang={lang} siteUrl={siteUrl} path={seoPage.path} wide={wide}>
          {content}
        </SiteLayout>
      );

      files[seoPage.file(lang)] = fillShell(shell, lang, renderHead(siteUrl, { ...meta, lang, path: seoPage.path }), body);
    };

    const brandImage = `${siteUrl}/og.png`;
    const homeDescription = t("seo.home.description");

    page(
      STATIC_PAGES.home,
      { title: t("seo.home.title"), description: homeDescription, image: brandImage, jsonLd: [organizationLd(siteUrl, homeDescription)] },
      <CatalogPage t={t} lang={lang} siteUrl={siteUrl} venues={catalog.venues} />,
      true
    );

    for (const venue of catalog.venues) {
      const seoPage = venuePage(venue.slug);
      const description = clip(
        t("seo.venue.description", {
          name: venue.name,
          price: t("venue.fromPrice", { price: money(Math.min(...venue.nominals)) }),
          description: venue.description[lang]
        })
      );

      page(
        seoPage,
        {
          title: t("seo.venue.title", { name: venue.name }),
          description,
          image: ogImage(venue.logo),
          jsonLd: [
            venueLd(
              venue,
              {
                url: pageUrl(siteUrl, seoPage.path, lang),
                description: venue.description[lang],
                offerName: (nominal) => t("seo.venue.offer", { name: venue.name, amount: money(nominal) })
              },
              siteUrl
            )
          ]
        },
        <VenuePage t={t} lang={lang} venue={venue} />
      );
    }

    const faqItems = getFaqItems(t);

    page(
      STATIC_PAGES.faq,
      {
        title: t("seo.pageTitle", { page: t("faq.title") }),
        description: t("seo.faq.description"),
        image: brandImage,
        jsonLd: [faqLd(faqItems)]
      },
      <FaqList title={t("faq.title")} items={faqItems} />
    );

    const href = (path: string) => pageUrl(siteUrl, path, lang);
    // The labels as about.md writes them, in every language.
    const aboutLinks = {
      "Публичная оферта": href(STATIC_PAGES.offer.path),
      "Политика конфиденциальности": href(STATIC_PAGES.privacy.path),
      "Ачык оферта": href(STATIC_PAGES.offer.path),
      "Купуялуулук саясаты": href(STATIC_PAGES.privacy.path),
      "Public offer": href(STATIC_PAGES.offer.path),
      "Privacy policy": href(STATIC_PAGES.privacy.path)
    };
    // The offer and the policy exist in Russian only.
    const russianOnly = lang === "ru" ? {} : { note: t("site.russianOnly") };

    for (const [key, text, extra] of [
      ["about", getAboutText(lang), { links: aboutLinks }],
      ["offer", LEGAL_TEXTS.offer, russianOnly],
      ["privacy", LEGAL_TEXTS.privacy, russianOnly]
    ] as const) {
      const title = t(`site.${key}.title`);

      page(
        STATIC_PAGES[key],
        { title: t("seo.pageTitle", { page: title }), description: t(`seo.${key}.description`), image: brandImage, jsonLd: [] },
        <LegalPage title={title} text={text} {...extra} />
      );
    }
  }

  files["sitemap.xml"] = renderSitemap(siteUrl, catalog);
  files["robots.txt"] = renderRobots(siteUrl);
  files["llms.txt"] = renderLlms(siteUrl, catalog);
  // Every other address (/app/*, /orders/*, /gift/*) and a venue added after
  // this build: the app as before.
  files[APP_SHELL_FILE] = shell;
  files["404.html"] = shell;

  return files;
};
