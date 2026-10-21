import { useState } from "react";

import { useTranslation } from "react-i18next";

import { type MerchantCertificate, useMerchantCertificateQuery } from "@entities/certificate";

import { BottomSheet } from "@shared/ui";

import { useRedeem } from "../../hooks/useRedeem";
import { CertificateCard } from "../certificate-card";

interface Props {
  // The row that was tapped — shown until the fresh lookup lands.
  certificate: MerchantCertificate;
  onClose: () => void;
}

// A certificate from the list, with "Redeem" if it's still active. Looked up
// again on open: the list may be minutes old, the status changes at the counter.
export const CertificateSheet = ({ certificate: row, onClose }: Props) => {
  const [justRedeemed, setJustRedeemed] = useState(false);

  const { t } = useTranslation();

  const { certificate = row, refetch } = useMerchantCertificateQuery(row.code);

  const { redeem, isRedeeming } = useRedeem({
    // The mutation puts the "used" certificate into this lookup's cache.
    onRedeemed: () => setJustRedeemed(true),
    onConflict: () => void refetch()
  });

  return (
    <BottomSheet
      title={t("merchant.certificates.sheetTitle")}
      onClose={onClose}
      dismissible={!isRedeeming}
    >
      <CertificateCard
        certificate={certificate}
        onRedeem={() => redeem(certificate)}
        isRedeeming={isRedeeming}
        justRedeemed={justRedeemed}
      />
    </BottomSheet>
  );
};
