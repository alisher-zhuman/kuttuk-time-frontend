import { type TFunction } from "i18next";

import { formatMoney, logoUrl } from "@shared/helpers";

import { type PublicVenue } from "../../catalog";
import { type SeoLanguage } from "../../site";

interface Props {
  t: TFunction;
  lang: SeoLanguage;
  venue: PublicVenue;
}

// The storefront as the app shows it, without the buying (that is the app's).
export const VenuePage = ({ t, lang, venue }: Props) => (
  <article className="flex flex-col gap-4 py-4">
    <div className="flex items-center gap-4">
      <img src={logoUrl(venue.logo, 64)} alt="" width={64} height={64} className="size-16 rounded-2xl shrink-0 object-cover" />
      <div className="min-w-0 flex flex-col gap-1">
        <h1 className="text-xl font-extrabold tracking-tight wrap-break-word">{venue.name}</h1>
        <p className="text-sm text-(--color-slate)">{venue.description[lang]}</p>
      </div>
    </div>

    <p className="flex flex-col gap-1 text-sm">
      <span>{venue.address}</span>
      <a href={venue.mapUrl} className="font-bold text-(--color-primary)" rel="noreferrer">{t("venue.openMap")}</a>
    </p>

    <section className="flex flex-col gap-2">
      <h2 className="text-xs font-bold text-(--color-hint) tracking-wider px-1">{t("venue.nominal")}</h2>
      <ul className="flex flex-wrap gap-2 list-none">
        {venue.nominals.map((nominal) => (
          <li key={nominal} className="px-4 py-2 rounded-full bg-(--color-card) border border-(--color-line) text-sm font-bold">
            {formatMoney(nominal, t("certificate.currency"))}
          </li>
        ))}
      </ul>
    </section>

    <p className="text-sm text-(--color-slate)">{t("venue.validity", { count: venue.validityMonths })}</p>
    <p className="text-sm text-(--color-slate)">{t("venue.giftHint")}</p>
  </article>
);
