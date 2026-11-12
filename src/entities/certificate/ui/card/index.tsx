import { useTranslation } from "react-i18next";

import { ChevronRight } from "lucide-react";

import { formatDate, formatMoney, logoUrl } from "@shared/helpers";

import { getCertificateDate, isUsable } from "../../model/date";
import type { Certificate } from "../../model/types";
import { CertificateCode } from "../code";

interface Props {
  certificate: Certificate;
  // The first cards are on screen at once (the page's LCP): load their logo
  // right away; the rest lazily.
  priority?: boolean;
  // Only usable certificates open - used / expired / gifted have nothing to act on.
  onOpen?: (() => void) | undefined;
}

export const CertificateCard = ({ certificate, onOpen, priority = false }: Props) => {
  const { t } = useTranslation();

  const { venue, amount, code } = certificate;

  const { key, date } = getCertificateDate(certificate);

  const status = t(key, { date: formatDate(date) });

  // Used / expired / given away: nothing to show at the counter - one compact
  // row, no code: the venue, then the amount and what happened when.
  if (!isUsable(certificate)) {
    return (
      <div className="flex items-center gap-3 px-3 py-2.5 bg-(--color-card) rounded-2xl border border-(--color-line) opacity-70">
        <img
          src={logoUrl(venue.logo, 36)}
          alt=""
          width={36}
          height={36}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="size-9 rounded-lg shrink-0 object-cover"
        />

        <span className="flex-1 min-w-0 flex flex-col">
          <span className="text-sm font-bold text-(--color-ink) line-clamp-2 wrap-break-word">{venue.name}</span>
          <span className="text-xs text-(--color-slate)">
            {formatMoney(amount, t("certificate.currency"))} · {status}
          </span>
        </span>
      </div>
    );
  }

  const header = (
    <>
      <img
        src={logoUrl(venue.logo, 48)}
        alt=""
        width={48}
        height={48}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        className="size-12 rounded-xl shrink-0 object-cover"
      />

      <span className="flex-1 min-w-0 flex flex-col gap-0.5 text-left">
        <span className="text-base font-extrabold tracking-tight text-(--color-ink) truncate">
          {venue.name}
        </span>
        <span className="text-base font-extrabold text-(--color-primary)">
          {formatMoney(amount, t("certificate.currency"))}
        </span>
      </span>

      {onOpen && <ChevronRight size={18} className="text-(--color-hint) shrink-0" />}
    </>
  );

  return (
    <div className="flex flex-col gap-3 p-3 bg-(--color-card) rounded-2xl border border-(--color-line)">
      {onOpen ? (
        <button
          type="button"
          onClick={onOpen}
          className="flex items-center gap-3 cursor-pointer"
        >
          {header}
        </button>
      ) : (
        <div className="flex items-center gap-3">{header}</div>
      )}

      <CertificateCode code={code} caption={status} />
    </div>
  );
};
