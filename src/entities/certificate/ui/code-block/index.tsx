import { useTranslation } from "react-i18next";

import { formatDate } from "@shared/helpers";
import { StatusBadge } from "@shared/ui";

import { type DatedCertificate, getCertificateDate } from "../../model/date";
import { CertificateCode } from "../code";
import { CertificateQr } from "../qr";

interface Props {
  certificate: DatedCertificate & { code: string };
}

// The buyer's view of one certificate's code: its status if no longer valid,
// the code with its one relevant date, and the QR for the counter — only while
// active (a QR of a used code would invite a pointless scan).
export const CertificateCodeBlock = ({ certificate }: Props) => {
  const { t } = useTranslation();

  const { key, date } = getCertificateDate(certificate);

  const isActive = certificate.status === "active";

  return (
    <>
      {!isActive && (
        <StatusBadge active={false} label={t(`certificate.status.${certificate.status}`)} />
      )}

      <div className="flex flex-col items-center gap-2">
        <span className="text-xs font-bold text-(--color-hint) uppercase tracking-wider">
          {t("certificate.code")}
        </span>

        <CertificateCode
          code={certificate.code}
          size="lg"
          caption={t(key, { date: formatDate(date) })}
        />
      </div>

      {isActive && <CertificateQr code={certificate.code} />}
    </>
  );
};
