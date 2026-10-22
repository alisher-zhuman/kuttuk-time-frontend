import { useTranslation } from "react-i18next";

import { CircleCheck } from "lucide-react";

import { formatCertificateCode, type MerchantCertificate } from "@entities/certificate";

import { cn, formatDate, formatDateTime, formatMoney } from "@shared/helpers";
import { StatusBadge } from "@shared/ui";

interface Props {
  certificate: MerchantCertificate;
  // Shown only for an active certificate.
  onRedeem?: (() => void) | undefined;
  isRedeeming?: boolean;
  // Just redeemed by this owner — a success line instead of "already used".
  justRedeemed?: boolean;
}

export const CertificateCard = ({ certificate, onRedeem, isRedeeming = false, justRedeemed = false }: Props) => {
  const { t } = useTranslation();

  const isActive = certificate.status === "active";

  return (
    <div
      className={cn(
        "flex flex-col gap-3 p-4 rounded-2xl bg-(--color-card) border border-(--color-line)",
        !isActive && !justRedeemed && "opacity-80"
      )}
    >
      {justRedeemed && (
        <span className="flex items-center gap-1.5 text-sm font-bold text-(--color-green)">
          <CircleCheck size={18} />
          {t("merchant.redeem.success")}
        </span>
      )}

      <div className="flex items-start justify-between gap-3">
        <span className="text-2xl font-extrabold text-(--color-ink)">
          {formatMoney(certificate.amount, t("certificate.currency"))}
        </span>

        {isActive && <StatusBadge active label={t("certificate.status.active")} />}
      </div>

      <div className="flex flex-col gap-0.5">
        {/* Which of the owner's venues sold it — a code from any of them is
            redeemable at the counter. */}
        <span className="text-base font-bold text-(--color-ink) break-words">
          {certificate.venue.name}
        </span>
        <span className="font-mono text-sm font-bold tracking-wider text-(--color-slate)">
          {formatCertificateCode(certificate.code)}
        </span>
      </div>

      {certificate.status === "used" && (
        <span
          className={cn(
            "text-sm font-bold",
            justRedeemed ? "text-(--color-slate)" : "text-(--color-accent)"
          )}
        >
          {t(justRedeemed ? "merchant.redeem.redeemedAt" : "merchant.redeem.alreadyUsed", {
            date: formatDateTime(certificate.usedAt)
          })}
        </span>
      )}

      {certificate.status === "expired" && (
        <span className="text-sm font-bold text-(--color-accent)">
          {t("merchant.redeem.expired")}
        </span>
      )}

      <div className="flex flex-col gap-1 text-sm text-(--color-slate)">
        {certificate.status !== "used" && (
          <span>{t("certificate.validUntil", { date: formatDate(certificate.validUntil) })}</span>
        )}
        <span>{t("merchant.redeem.soldAt", { date: formatDate(certificate.createdAt) })}</span>
      </div>

      {isActive && onRedeem && (
        <button
          type="button"
          disabled={isRedeeming}
          onClick={onRedeem}
          className="py-3 rounded-xl bg-(--color-primary) text-(--color-card) text-sm font-bold cursor-pointer disabled:opacity-60"
        >
          {t("merchant.redeem.submit")}
        </button>
      )}
    </div>
  );
};
