import { useTranslation } from "react-i18next";

import {
  type Certificate,
  CertificateCodeBlock,
  useCertificateShareButton
} from "@entities/certificate";

import { formatMoney, logoUrl } from "@shared/helpers";

interface Props {
  certificate: Certificate;
}

export const CertificateDetail = ({ certificate }: Props) => {
  const { t } = useTranslation();

  const { venue, amount, code, status } = certificate;

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
      <img
        src={logoUrl(venue.logo, 64)}
        width={64}
        height={64}
        alt=""
        className="size-16 rounded-2xl object-cover"
      />

      <div className="flex flex-col items-center gap-1">
        <span className="text-base font-semibold text-(--color-slate)">{venue.name}</span>
        <span className="text-3xl font-extrabold text-(--color-ink)">
          {formatMoney(amount, t("certificate.currency"))}
        </span>
      </div>

      <CertificateCodeBlock certificate={certificate} />
    </div>
  );
};
