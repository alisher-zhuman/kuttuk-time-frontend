import { useTranslation } from "react-i18next";

// Under the certificate while «Подарить» sends the claimable card: what the
// friend gets, and that sending again cancels the old link.
export const CertificateGiftHint = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-1 max-w-xs text-center">
      <span className="text-sm text-(--color-slate)">{t("certificate.giftHint")}</span>
      <span className="text-xs text-(--color-hint)">{t("certificate.giftResend")}</span>
    </div>
  );
};
