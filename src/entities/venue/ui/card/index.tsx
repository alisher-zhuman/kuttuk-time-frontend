import { useTranslation } from "react-i18next";

import { ChevronRight } from "lucide-react";

import { getVenueRoute } from "@shared/constants";
import { formatMoney, logoUrl } from "@shared/helpers";
import { useHaptic, useNavigateTo } from "@shared/hooks";

import type { Venue } from "../../model/types";

interface Props {
  venue: Venue;
  // The first cards are on screen at once (the page's LCP): load their logo
  // right away; the rest lazily.
  priority?: boolean;
}

export const VenueCard = ({ venue, priority = false }: Props) => {
  const { t } = useTranslation();
  const haptic = useHaptic();
  const navigateTo = useNavigateTo();

  // One interpolated string, not "from" + price: kg puts the price first and
  // attaches a suffix to it («500 сомдон баштап»). Non-breaking spaces keep
  // "10 000 сом" whole when the label wraps.
  const fromPrice = t("venue.fromPrice", {
    price: formatMoney(venue.minNominal, t("certificate.currency")).replace(/ /g, "\u00A0")
  });

  const handleClick = () => {
    haptic.light();
    navigateTo(getVenueRoute(venue.id));
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full bg-(--color-card) rounded-2xl p-3 border border-(--color-line) shadow-xs flex items-center gap-3.5 text-left cursor-pointer"
    >
      <img
        src={logoUrl(venue.logo, 48)}
        // The name is right next to it — the logo itself says nothing more.
        alt=""
        width={48}
        height={48}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        className="size-12 rounded-xl shrink-0 object-cover"
      />

      <span className="flex-1 min-w-0 flex flex-col">
        <span className="text-base font-extrabold tracking-tight text-(--color-ink) wrap-break-word">
          {venue.name}
        </span>
        <span className="text-sm text-(--color-slate) font-semibold mt-0.5 truncate">
          {venue.description}
        </span>
      </span>

      {/* Wraps instead of stretching: kg «500 сомдон баштап» takes two lines
          rather than squeezing the name off the card. */}
      <span className="shrink-0 max-w-28 text-right text-sm leading-tight text-(--color-primary) font-extrabold">
        {fromPrice}
      </span>

      <ChevronRight size={17} color="var(--color-hint)" />
    </button>
  );
};
