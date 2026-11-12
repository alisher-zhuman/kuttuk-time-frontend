import { type TFunction } from "i18next";

import { formatMoney, logoUrl } from "@shared/helpers";

import { type PublicVenue } from "../../catalog";
import { pageUrl, type SeoLanguage, venuePage } from "../../site";

interface Props {
  t: TFunction;
  lang: SeoLanguage;
  siteUrl: string;
  venues: PublicVenue[];
}

export const CatalogPage = ({ t, lang, siteUrl, venues }: Props) => (
  <>
    <h1 className="pt-4 text-2xl font-extrabold tracking-tight">{t("seo.home.heading")}</h1>
    <p className="pt-2 text-base text-(--color-slate)">{t("seo.home.intro")}</p>

    <h2 className="text-xs font-bold text-(--color-hint) tracking-wider pt-5.5 pb-2.5 px-1">{t("home.venuesSection")}</h2>

    <ul className="pb-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 list-none">
      {venues.map((venue) => (
        <li key={venue.id}>
          <a
            href={pageUrl(siteUrl, venuePage(venue.slug).path, lang)}
            className="h-full bg-(--color-card) rounded-2xl p-3 border border-(--color-line) shadow-xs flex items-center gap-3.5"
          >
            <img src={logoUrl(venue.logo, 48)} alt="" width={48} height={48} className="size-12 rounded-xl shrink-0 object-cover" />
            <span className="flex-1 min-w-0 flex flex-col">
              <span className="text-base font-extrabold tracking-tight line-clamp-2 wrap-break-word">{venue.name}</span>
              <span className="text-sm text-(--color-slate) font-semibold mt-0.5 line-clamp-2">{venue.description[lang]}</span>
              <span className="text-sm text-(--color-primary) font-extrabold mt-1">
                {t("venue.fromPrice", { price: formatMoney(Math.min(...venue.nominals), t("certificate.currency")) })}
              </span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  </>
);
