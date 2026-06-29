import { useTranslation } from "react-i18next";

import { Gift } from "lucide-react";

import { formatMoney } from "@shared/helpers";

interface Props {
  merchantName: string;
  amount: number;
  validityMonths: number;
}

export const CertPreviewCard = ({
  merchantName,
  amount,
  validityMonths,
}: Props) => {
  const { t } = useTranslation();

  return (
    <div
      className="relative rounded-2xl overflow-hidden text-white p-5"
      style={{
        background: "linear-gradient(125deg, var(--cert-from), var(--cert-to))",
      }}
    >
      <div className="absolute -right-7 -top-7 size-32 rounded-full bg-white/15 pointer-events-none" />
      <div className="absolute right-6 -bottom-10 size-24 rounded-full bg-white/10 pointer-events-none" />

      <div className="relative flex flex-col">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold tracking-widest opacity-90">
            KuttukTime
          </span>

          <Gift size={20} strokeWidth={1.8} className="opacity-90" />
        </div>

        <span className="text-sm font-bold opacity-95 mt-4">
          {merchantName}
        </span>
        <span className="text-3xl font-extrabold tracking-tight mt-0.5">
          {formatMoney(amount, t("certificate.currency"))}
        </span>
        <span className="text-xs font-semibold opacity-80 mt-2">
          {t("merchantDetail.validity", { months: validityMonths })}
        </span>
      </div>
    </div>
  );
};
