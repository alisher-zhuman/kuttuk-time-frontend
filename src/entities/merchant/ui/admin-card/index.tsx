import { useTranslation } from "react-i18next";

import { ChevronRight, UserRound } from "lucide-react";

import { StatusBadge } from "@shared/ui";

import type { AdminMerchant } from "../../model/types";

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
      <span className="size-12 rounded-xl shrink-0 flex items-center justify-center bg-(--color-chip) text-(--color-hint)">
        <UserRound size={22} />
      </span>

      <span className="flex-1 min-w-0 flex flex-col">
        <span className="text-base font-extrabold tracking-tight text-(--color-ink) truncate">
          {merchant.name}
        </span>
        <span className="text-xs font-semibold text-(--color-hint)">
          {t("merchantForm.telegramId")} {merchant.telegramId}
        </span>
      </span>

      <StatusBadge
        active={merchant.isActive}
        label={t(merchant.isActive ? "admin.venues.active" : "admin.venues.inactive")}
      />

      <ChevronRight size={17} color="var(--color-hint)" />
    </button>
  );
};
