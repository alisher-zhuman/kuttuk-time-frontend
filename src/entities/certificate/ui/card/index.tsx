import { useTranslation } from "react-i18next";

import { ChevronRight } from "lucide-react";

import { cn, formatDate, formatMoney } from "@shared/helpers";

import { getCertificateDate } from "../../model/date";
import type { Certificate } from "../../model/types";
import { CertificateCode } from "../code";

interface Props {
  certificate: Certificate;
  // Only active certificates open — used/expired have nothing to act on.
  onOpen?: (() => void) | undefined;
}

export const CertificateCard = ({ certificate, onOpen }: Props) => {
  const { t } = useTranslation();

  const { venue, amount, code, status } = certificate;

  const { key, date } = getCertificateDate(certificate);

  const header = (
    <>
      <img
        src={venue.logo}
        alt=""
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
    <div
      className={cn(
        "flex flex-col gap-3 p-3 bg-(--color-card) rounded-2xl border border-(--color-line)",
        status !== "active" && "opacity-55"
      )}
    >
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

      <CertificateCode code={code} caption={t(key, { date: formatDate(date) })} />
    </div>
  );
};
