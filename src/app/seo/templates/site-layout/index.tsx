import { type ReactNode } from "react";

import { type TFunction } from "i18next";

import { LANGUAGE_BADGE, SUPPORT_URL } from "@shared/constants";
import { Logo } from "@shared/ui";

import { pageUrl, SEO_LANGUAGES, type SeoLanguage, STATIC_PAGES } from "../../site";

interface Props {
  t: TFunction;
  lang: SeoLanguage;
  siteUrl: string;
  // This page's path - the language links lead to its other versions.
  path: string;
  wide?: boolean;
  children: ReactNode;
}

// The website's frame as plain links - what a crawler follows before (and
// without) the app's JavaScript.
export const SiteLayout = ({ t, lang, siteUrl, path, wide = false, children }: Props) => {
  const href = (to: string) => pageUrl(siteUrl, to, lang);
  const link = "text-xs font-semibold text-(--color-slate)";

  return (
    <div className="min-h-dvh flex flex-col bg-(--color-bg) text-(--color-ink)">
      <header className="w-full max-w-6xl mx-auto px-4 h-12 flex items-center justify-between gap-2.5">
        <a href={href(STATIC_PAGES.home.path)}>
          <Logo />
        </a>

        <nav className="flex items-center gap-3">
          {SEO_LANGUAGES.map((other) => (
            <a
              key={other}
              href={pageUrl(siteUrl, path, other)}
              hrefLang={other === "kg" ? "ky" : other}
              aria-current={other === lang ? "page" : undefined}
              className={`text-sm font-extrabold ${other === lang ? "text-(--color-primary)" : "text-(--color-slate)"}`}
            >
              {LANGUAGE_BADGE[other].code}
            </a>
          ))}
        </nav>
      </header>

      <main className={`flex-1 flex flex-col w-full mx-auto px-4 ${wide ? "max-w-6xl" : "max-w-xl"}`}>{children}</main>

      <footer className="flex flex-col items-center gap-2 py-4 px-4 text-center">
        <nav className="flex flex-wrap justify-center gap-x-4 gap-y-1">
          <a className={link} href={href(STATIC_PAGES.faq.path)}>{t("faq.title")}</a>
          <a className={link} href={href(STATIC_PAGES.about.path)}>{t("site.about.title")}</a>
          <a className={link} href={href(STATIC_PAGES.offer.path)}>{t("site.offer.title")}</a>
          <a className={link} href={href(STATIC_PAGES.privacy.path)}>{t("site.privacy.title")}</a>
          <a className={link} href={SUPPORT_URL}>{t("site.support")}</a>
        </nav>
        <span className="text-xs text-(--color-hint)">{t("site.payment")}</span>
        <span className="text-xs text-(--color-hint)">{t("footer.madeWithLove")}</span>
      </footer>
    </div>
  );
};
