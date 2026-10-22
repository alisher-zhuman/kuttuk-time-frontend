import { useTranslation } from "react-i18next";

import { type MerchantCertificate } from "@entities/certificate";

import { BottomSheet } from "@shared/ui";

import { CertificateLookup } from "../certificate-lookup";

interface Props {
  certificate: MerchantCertificate;
  onClose: () => void;
}

// A tapped row: the same card as the code field, looked up again (the list may
// be minutes old).
export const CertificateSheet = ({ certificate, onClose }: Props) => {
  const { t } = useTranslation();

  return (
    <BottomSheet title={t("merchant.certificates.sheetTitle")} onClose={onClose}>
      <CertificateLookup code={certificate.code} fallback={certificate} />
    </BottomSheet>
  );
};
