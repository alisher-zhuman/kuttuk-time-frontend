import { useTranslation } from "react-i18next";

import { cn } from "@shared/helpers";

import type { AdminMerchant } from "../../../model/types";

interface Props {
  merchant: AdminMerchant;
}

export const AdminMerchantCard = ({ merchant }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="w-full bg-(--color-card) rounded-2xl p-3 border border-(--color-line) shadow-xs flex items-center gap-3.5">
      <img
        src={merchant.logo}
        alt={merchant.name}
        className="size-12 rounded-xl shrink-0 object-cover"
      />

      <span className="flex-1 min-w-0 text-base font-extrabold tracking-tight text-(--color-ink) truncate">
        {merchant.name}
      </span>

      <span
        className={cn(
          "flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg whitespace-nowrap shrink-0",
          merchant.isActive
            ? "bg-(--color-green-tint) text-(--color-green)"
            : "bg-(--color-surface) text-(--color-hint)",
        )}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
        {t(merchant.isActive ? "admin.merchants.active" : "admin.merchants.inactive")}
      </span>
    </div>
  );
};
