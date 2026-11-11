import { useTranslation } from "react-i18next";

import {
  type Certificate,
  CertificateCodeBlock,
  CertificateGiftHint,
  isUsable,
  useCertificateShareButton
} from "@entities/certificate";
import { VenuePlace } from "@entities/venue";

import { formatMoney, logoUrl } from "@shared/helpers";

interface Props {
  certificate: Certificate;
  // Opened right after «Забрать подарок»: say what to do with it now.
  isJustClaimed?: boolean;
}

export const CertificateDetail = ({ certificate, isJustClaimed = false }: Props) => {
  const { t } = useTranslation();

  const { venue, amount, code } = certificate;

  // Sharing a used / expired / already given code would only mislead the
  // recipient.
  const { canGift } = useCertificateShareButton({
    id: certificate.id,
    code,
    amount,
    venueName: venue.name,
    hidden: !isUsable(certificate)
  });

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-5 py-8 text-center">
      {isJustClaimed && isUsable(certificate) && (
        <p role="status" className="px-4 py-3 rounded-2xl bg-(--color-green-tint) text-sm font-semibold text-(--color-ink) max-w-xs">
          {t("gift.claimedHint")}
        </p>
      )}

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

      <VenuePlace address={venue.address} mapUrl={venue.mapUrl} align="center" />

      <CertificateCodeBlock certificate={certificate} />

      {canGift && <CertificateGiftHint />}
    </div>
  );
};
