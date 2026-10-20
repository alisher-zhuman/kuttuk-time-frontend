import { useTranslation } from "react-i18next";

import { type MerchantCertificate } from "@entities/certificate";

import { cn, formatDate, formatDateTime, formatMoney } from "@shared/helpers";

interface Props {
  certificate: MerchantCertificate;
}

export const CertificateRow = ({ certificate }: Props) => {
  const { t } = useTranslation();

  const statusLine = {
    active: () => t("certificate.validUntil", { date: formatDate(certificate.validUntil) }),
    used: () =>
      certificate.status === "used"
        ? t("merchant.redeem.redeemedAt", { date: formatDateTime(certificate.usedAt) })
        : "",
    expired: () => t("certificate.expiredAt", { date: formatDate(certificate.validUntil) })
  }[certificate.status]();

  return (
    <div
      className={cn(
        "flex items-start justify-between gap-3 p-3 rounded-2xl bg-(--color-card) border border-(--color-line)",
        certificate.status !== "active" && "opacity-60"
      )}
    >
      <div className="flex flex-col gap-1 min-w-0">
        <span className="font-mono text-sm font-bold tracking-wider text-(--color-ink)">
          {certificate.code}
        </span>
        <span className="text-xs font-semibold text-(--color-slate)">{statusLine}</span>
        <span className="text-xs text-(--color-hint)">
          {t("merchant.redeem.soldAt", { date: formatDate(certificate.createdAt) })}
        </span>
      </div>

      <span className="shrink-0 text-base font-extrabold text-(--color-primary)">
        {formatMoney(certificate.amount, t("certificate.currency"))}
      </span>
    </div>
  );
};
