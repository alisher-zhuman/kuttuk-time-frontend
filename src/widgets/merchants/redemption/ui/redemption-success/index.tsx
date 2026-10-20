import { useTranslation } from "react-i18next";

import { CircleCheck } from "lucide-react";

import { type MerchantCertificate } from "@entities/certificate";

import { formatDateTime, formatMoney } from "@shared/helpers";

interface Props {
  certificate: Extract<MerchantCertificate, { status: "used" }>;
  onNext: () => void;
}

export const RedemptionSuccess = ({ certificate, onNext }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-5 py-8 text-center">
      <span className="size-16 rounded-2xl flex items-center justify-center bg-(--color-green-tint) text-(--color-green)">
        <CircleCheck size={32} strokeWidth={1.5} />
      </span>

      <div className="flex flex-col items-center gap-1">
        <h1 className="text-xl font-extrabold tracking-tight text-(--color-ink)">
          {t("merchant.redeem.success")}
        </h1>
        <span className="text-3xl font-extrabold text-(--color-ink)">
          {formatMoney(certificate.amount, t("certificate.currency"))}
        </span>
      </div>

      <div className="flex flex-col items-center gap-1 text-sm text-(--color-slate)">
        <span className="font-mono font-bold tracking-wider">{certificate.code}</span>
        <span>{t("merchant.redeem.redeemedAt", { date: formatDateTime(certificate.usedAt) })}</span>
      </div>

      <button
        type="button"
        onClick={onNext}
        className="px-6 py-3 rounded-full bg-(--color-primary) text-(--color-card) font-semibold text-sm cursor-pointer"
      >
        {t("merchant.redeem.next")}
      </button>
    </div>
  );
};
