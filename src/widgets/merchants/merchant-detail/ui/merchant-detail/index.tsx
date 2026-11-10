import { useTranslation } from "react-i18next";

import { ClipboardList, Pencil, UserRound } from "lucide-react";

import { type AdminMerchantDetail, MerchantOwnerStatus } from "@entities/merchant";

import { formatDate } from "@shared/helpers";
import { useHaptic } from "@shared/hooks";
import { MetaField, RowButton, StatusBadge } from "@shared/ui";

import { MerchantDetailVenues } from "../merchant-detail-venues";

interface Props {
  merchant: AdminMerchantDetail;
  onEdit: () => void;
  onOpenVenue: (venueId: number) => void;
  onAddVenue: () => void;
  onOpenOrders: () => void;
}

// Free text as typed (line breaks kept), or a muted "not set".
const Note = ({ text, empty }: { text: string | null; empty: string }) =>
  text ? (
    <span className="font-semibold whitespace-pre-wrap wrap-break-word">{text}</span>
  ) : (
    <span className="font-semibold text-(--color-hint)">{empty}</span>
  );

export const MerchantDetail = ({ merchant, onEdit, onOpenVenue, onAddVenue, onOpenOrders }: Props) => {
  const { t } = useTranslation();

  const haptic = useHaptic();

  return (
    <div className="flex flex-col py-4 gap-5">
      <div className="flex items-center gap-3.5">
        <span className="size-16 rounded-xl shrink-0 flex items-center justify-center bg-(--color-chip) text-(--color-hint)">
          <UserRound size={28} />
        </span>

        {/* Status under the name: beside it, a long name broke a letter per line. */}
        <span className="flex-1 min-w-0 flex flex-col items-start gap-1.5">
          <span className="max-w-full text-xl font-extrabold tracking-tight text-(--color-ink) leading-tight line-clamp-3 wrap-break-word">
            {merchant.name}
          </span>

          <StatusBadge
            active={merchant.isActive}
            label={t(merchant.isActive ? "admin.venues.active" : "admin.venues.inactive")}
          />
          <MerchantOwnerStatus owner={merchant.owner} />
        </span>

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
        <div className="col-span-2">
          <MetaField
            label={t("merchantForm.payoutDetails")}
            value={<Note text={merchant.payoutDetails} empty={t("admin.merchants.detail.notSet")} />}
          />
        </div>
        <div className="col-span-2">
          <MetaField
            label={t("merchantForm.contact")}
            value={<Note text={merchant.contact} empty={t("admin.merchants.detail.notSet")} />}
          />
        </div>
      </div>

      <RowButton
        icon={<ClipboardList size={20} />}
        label={t("admin.merchants.detail.orders")}
        onClick={onOpenOrders}
      />

      <MerchantDetailVenues
        venues={merchant.venues}
        onOpenVenue={onOpenVenue}
        onAddVenue={onAddVenue}
      />
    </div>
  );
};
