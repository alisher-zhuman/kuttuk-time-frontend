import { useTranslation } from "react-i18next";

import { ChevronRight } from "lucide-react";

import { StatusBadge } from "@shared/ui";

import type { AdminMerchant } from "../../../model/types";

interface Props {
  merchant: AdminMerchant;
  onClick: () => void;
}

export const AdminMerchantCard = ({ merchant, onClick }: Props) => {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full bg-(--color-card) rounded-2xl p-3 border border-(--color-line) shadow-xs flex items-center gap-3.5 text-left cursor-pointer"
    >
      <img
        src={merchant.logo}
        alt={merchant.name}
        className="size-12 rounded-xl shrink-0 object-cover"
      />

      <span className="flex-1 min-w-0 text-base font-extrabold tracking-tight text-(--color-ink) truncate">
        {merchant.name}
      </span>

      <StatusBadge
        active={merchant.isActive}
        label={t(merchant.isActive ? "admin.merchants.active" : "admin.merchants.inactive")}
      />

      <ChevronRight size={17} color="var(--color-hint)" />
    </button>
  );
};
