import { useTranslation } from "react-i18next";

import {
  type Certificate,
  CertificateCode,
  getCertificateDate,
  useCertificateShareButton
} from "@entities/certificate";

import { formatDate, formatMoney } from "@shared/helpers";
import { StatusBadge } from "@shared/ui";

interface Props {
  certificate: Certificate;
}

export const CertificateDetail = ({ certificate }: Props) => {
  const { t } = useTranslation();

  const { venue, amount, code, status } = certificate;

  const { key, date } = getCertificateDate(certificate);

  const isActive = status === "active";

  // Sharing a used/expired code would only mislead the recipient.
  useCertificateShareButton({
    id: certificate.id,
    code,
    amount,
    venueName: venue.name,
    hidden: !isActive
  });

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-5 py-8 text-center">
      <img src={venue.logo} alt="" className="size-16 rounded-2xl object-cover" />

      <div className="flex flex-col items-center gap-1">
        <span className="text-base font-semibold text-(--color-slate)">{venue.name}</span>
        <span className="text-3xl font-extrabold text-(--color-ink)">
          {formatMoney(amount, t("certificate.currency"))}
        </span>
      </div>

      {!isActive && <StatusBadge active={false} label={t(`certificate.status.${status}`)} />}

      <div className="flex flex-col items-center gap-2">
        <span className="text-xs font-bold text-(--color-hint) uppercase tracking-wider">
          {t("certificate.code")}
        </span>

        <CertificateCode code={code} size="lg" caption={t(key, { date: formatDate(date) })} />
      </div>
    </div>
  );
};
