import { useTranslation } from "react-i18next";

import { QrCode } from "@shared/ui";

interface Props {
  // The 8 digits as stored — no spaces, so the cashier's scanner gets a code.
  code: string;
}

// The certificate code as a QR for the owner's scanner.
export const CertificateQr = ({ code }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center gap-1.5">
      <QrCode value={code} label={t("certificate.qrHint")} className="size-48" />

      <span className="text-xs font-semibold text-(--color-hint)">{t("certificate.qrHint")}</span>
    </div>
  );
};
