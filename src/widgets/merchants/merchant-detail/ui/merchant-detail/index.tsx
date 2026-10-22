import { useTranslation } from "react-i18next";

import { Pencil, UserRound } from "lucide-react";

import { type AdminMerchantDetail } from "@entities/merchant";

import { formatDate } from "@shared/helpers";
import { useHaptic } from "@shared/hooks";
import { MetaField, StatusBadge } from "@shared/ui";

import { MerchantDetailVenues } from "../merchant-detail-venues";

interface Props {
  merchant: AdminMerchantDetail;
  onEdit: () => void;
  onOpenVenue: (venueId: number) => void;
  onAddVenue: () => void;
}

export const MerchantDetail = ({ merchant, onEdit, onOpenVenue, onAddVenue }: Props) => {
  const { t } = useTranslation();

  const haptic = useHaptic();

  return (
    <div className="flex flex-col py-4 gap-5">
      <div className="flex items-center gap-3.5">
        <span className="size-16 rounded-xl shrink-0 flex items-center justify-center bg-(--color-chip) text-(--color-hint)">
          <UserRound size={28} />
        </span>

        <span className="flex-1 min-w-0 text-xl font-extrabold tracking-tight text-(--color-ink) leading-tight break-words">
          {merchant.name}
        </span>

        <StatusBadge
          active={merchant.isActive}
          label={t(merchant.isActive ? "admin.venues.active" : "admin.venues.inactive")}
        />

        <button
          type="button"
          aria-label={t("merchantForm.edit")}
          onClick={() => {
            haptic.light();
            onEdit();
          }}
          className="flex items-center justify-center size-9 rounded-full border border-(--color-line) bg-(--color-chip) text-(--color-hint) shrink-0 cursor-pointer"
        >
          <Pencil size={16} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-4">
        <MetaField label={t("admin.merchants.detail.telegramId")} value={merchant.telegramId} />
        <MetaField
          label={t("admin.merchants.detail.createdAt")}
          value={formatDate(merchant.createdAt)}
        />
      </div>

      <MerchantDetailVenues
        venues={merchant.venues}
        onOpenVenue={onOpenVenue}
        onAddVenue={onAddVenue}
      />
    </div>
  );
};
