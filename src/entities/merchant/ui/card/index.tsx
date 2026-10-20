import { useTranslation } from "react-i18next";

import { ChevronRight } from "lucide-react";

import { getMerchantRoute } from "@shared/constants";
import { formatMoney } from "@shared/helpers";
import { useHaptic, useNavigateTo } from "@shared/hooks";

import type { Merchant } from "../../model/types";

interface Props {
  merchant: Merchant;
}

export const MerchantCard = ({ merchant }: Props) => {
  const { t } = useTranslation();
  const haptic = useHaptic();
  const navigateTo = useNavigateTo();

  // One interpolated string, not "from" + price: kg puts the price first and
  // attaches a suffix to it («500 сомдон баштап»). Non-breaking spaces keep
  // "10 000 сом" whole when the label wraps.
  const fromPrice = t("merchant.fromPrice", {
    price: formatMoney(merchant.minNominal, t("certificate.currency")).replace(/ /g, "\u00A0")
  });

  const handleClick = () => {
    haptic.light();
    navigateTo(getMerchantRoute(merchant.id));
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`${merchant.name}, ${fromPrice}`}
      className="w-full bg-(--color-card) rounded-2xl p-3 border border-(--color-line) shadow-xs flex items-center gap-3.5 text-left cursor-pointer"
    >
      <img
        src={merchant.logo}
        alt={merchant.name}
        className="size-12 rounded-xl shrink-0 object-cover"
      />

      <span className="flex-1 min-w-0 flex flex-col">
        <span className="text-base font-extrabold tracking-tight text-(--color-ink) break-words">
          {merchant.name}
        </span>
        <span className="text-sm text-(--color-slate) font-semibold mt-0.5 truncate">
          {merchant.description}
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
