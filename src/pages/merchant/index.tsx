import { useState } from "react";
import { useParams } from "react-router";

import { useTranslation } from "react-i18next";

import { Check } from "lucide-react";

import { useMerchantQuery } from "@entities/merchant";

import { formatMoney } from "@shared/helpers";
import { useHaptic } from "@shared/hooks";

export const MerchantPage = () => {
  const { merchantId } = useParams<{ merchantId: string }>();
  const { t } = useTranslation();
  const haptic = useHaptic();

  const { merchant, isLoading } = useMerchantQuery(Number(merchantId));

  const [selectedNominal, setSelectedNominal] = useState<number | null>(null);

  if (isLoading) return <MerchantPageSkeleton />;
  if (!merchant) return null;

  const currency = t("certificate.currency");
  const activeNominal = selectedNominal ?? merchant.nominals[0];

  return (
    <div className="flex-1 flex flex-col py-4 gap-5">
      <div className="flex items-center gap-3.5">
        <img
          src={merchant.logo}
          alt={merchant.name}
          className="size-16 rounded-xl shrink-0 object-cover"
        />
        <div className="flex flex-col min-w-0">
          <span className="text-xl font-extrabold tracking-tight text-(--color-ink) leading-tight">
            {merchant.name}
          </span>
          <span className="text-sm text-(--color-slate) font-semibold mt-1 truncate">
            {merchant.description}
          </span>
        </div>
      </div>

      <div
        className="relative rounded-2xl overflow-hidden text-white p-5"
        style={{
          background: "linear-gradient(125deg, var(--cert-from), var(--cert-to))",
        }}
      >
        <div className="absolute -right-7 -top-7 size-32 rounded-full bg-white/15 pointer-events-none" />
        <div className="absolute right-6 -bottom-10 size-24 rounded-full bg-white/10 pointer-events-none" />
        <div className="relative flex flex-col">
          <span className="text-xs font-extrabold tracking-widest opacity-90">KUTTUKTIME</span>
          <span className="text-sm font-bold opacity-95 mt-4">{merchant.name}</span>
          <span className="text-3xl font-extrabold tracking-tight mt-0.5">
            {formatMoney(activeNominal ?? 0, currency)}
          </span>
          <span className="text-xs font-semibold opacity-80 mt-2">
            {t("merchantDetail.validity", { months: merchant.validityMonths })}
          </span>
        </div>
      </div>

      <div>
        <p className="text-xs font-bold text-(--color-hint) tracking-widest px-1 pb-2.5">
          {t("merchantDetail.nominal")}
        </p>
        <div className="bg-(--color-card) rounded-2xl border border-(--color-line) shadow-xs overflow-hidden">
          {merchant.nominals.map((nominal, index) => {
            const isSelected = nominal === activeNominal;
            return (
              <button
                key={nominal}
                type="button"
                onClick={() => {
                  haptic.selection();
                  setSelectedNominal(nominal);
                }}
                className={[
                  "w-full flex items-center justify-between px-4 py-3.5 cursor-pointer transition-colors",
                  index > 0 ? "border-t border-(--color-line)" : "",
                  isSelected ? "bg-(--color-primary-tint)" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <span
                  className={[
                    "text-base",
                    isSelected
                      ? "font-extrabold text-(--color-primary)"
                      : "font-semibold text-(--color-ink)",
                  ].join(" ")}
                >
                  {formatMoney(nominal, currency)}
                </span>
                {isSelected && (
                  <Check size={18} color="var(--color-primary)" strokeWidth={2.5} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-auto sticky bottom-0 pt-3 pb-2 bg-(--color-bg)">
        <button
          type="button"
          onClick={() => haptic.medium()}
          className="w-full h-14 rounded-2xl bg-(--color-primary) text-white font-extrabold text-base flex flex-col items-center justify-center gap-0.5 cursor-pointer shadow-lg"
        >
          <span>{t("merchantDetail.buy")}</span>
          {activeNominal != null && (
            <span className="text-xs font-bold opacity-85">
              {formatMoney(activeNominal, currency)}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

const MerchantPageSkeleton = () => (
  <div className="flex-1 flex flex-col py-4 gap-5">
    <div className="flex items-center gap-3.5">
      <span className="size-16 rounded-xl shrink-0 bg-(--color-chip) animate-pulse" />
      <div className="flex flex-col gap-2">
        <span className="h-5 w-32 rounded-lg bg-(--color-chip) animate-pulse" />
        <span className="h-3.5 w-48 rounded-lg bg-(--color-chip) animate-pulse" />
      </div>
    </div>
    <span className="h-36 w-full rounded-2xl bg-(--color-chip) animate-pulse" />
    <div className="flex flex-col gap-2.5">
      <span className="h-3 w-20 rounded-md bg-(--color-chip) animate-pulse" />
      <span className="h-52 w-full rounded-2xl bg-(--color-chip) animate-pulse" />
    </div>
  </div>
);
