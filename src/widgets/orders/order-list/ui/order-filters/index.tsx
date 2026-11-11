import { useState } from "react";

import { useTranslation } from "react-i18next";

import { X } from "lucide-react";

import { useAdminMerchantQuery, useAdminMerchantsQuery } from "@entities/merchant";
import { type AdminOrderFilters, ORDER_STATUSES, type OrderStatus } from "@entities/order";
import { useAdminVenueQuery, useAdminVenuesQuery } from "@entities/venue";

import { useDebounce, useHaptic } from "@shared/hooks";
import { Select } from "@shared/ui";

export type OrderFilterValues = Omit<AdminOrderFilters, "search">;

interface Props {
  filters: OrderFilterValues;
  onChange: (patch: Partial<OrderFilterValues>) => void;
}

// «На проверке» first - the queue to watch; the rest in the backend's order.
const STATUSES: OrderStatus[] = ["needs_review", ...ORDER_STATUSES.filter((status) => status !== "needs_review")];

// The orders' filter row: status, venue and owner as lists (venue and owner
// searched on the server), each reset by its ×. The buyer has no picker - it
// comes from an order's «ID покупателя» link and shows as a pill.
export const OrderFilters = ({ filters, onChange }: Props) => {
  const [venueSearch, setVenueSearch] = useState("");
  const [merchantSearch, setMerchantSearch] = useState("");

  const { t } = useTranslation();

  const haptic = useHaptic();

  const debouncedVenueSearch = useDebounce(venueSearch);
  const debouncedMerchantSearch = useDebounce(merchantSearch);

  const venues = useAdminVenuesQuery({
    search: debouncedVenueSearch.trim(),
    category: null,
    isActive: null,
    merchantId: null
  });
  const merchants = useAdminMerchantsQuery({ search: debouncedMerchantSearch.trim(), isActive: null });

  // Names of the chosen ones - a link may open the list already filtered.
  const { venue } = useAdminVenueQuery(filters.venueId !== null ? String(filters.venueId) : undefined);
  const { merchant } = useAdminMerchantQuery(filters.merchantId !== null ? String(filters.merchantId) : undefined);

  return (
    // One row scrolled sideways, like the catalog's categories - wrapped, three
    // pills took half a 320 px screen.
    <div className="-mx-4 px-4 flex gap-2 overflow-x-auto">
      <Select
        variant="filter"
        clearable
        label={t("admin.orders.filters.status")}
        placeholder={t("admin.orders.all")}
        options={STATUSES.map((status) => ({ value: status, label: t(`admin.orders.status.${status}`) }))}
        value={filters.status ? [filters.status] : []}
        onChange={([status]) => onChange({ status: status ?? null })}
      />

      <Select
        variant="filter"
        clearable
        label={t("admin.orders.filters.venue")}
        placeholder={t("admin.orders.all")}
        options={venues.venues.map((item) => ({ value: item.id, label: item.name }))}
        value={filters.venueId !== null ? [filters.venueId] : []}
        onChange={([venueId]) => onChange({ venueId: venueId ?? null })}
        search={{ value: venueSearch, onChange: setVenueSearch, placeholder: t("admin.orders.filters.venueSearch") }}
        isLoading={venues.isFetching}
        selectedLabel={venue?.name}
      />

      <Select
        variant="filter"
        clearable
        label={t("admin.orders.filters.merchant")}
        placeholder={t("admin.orders.all")}
        options={merchants.merchants.map((item) => ({
          value: item.id,
          label: item.name,
          hint: `Telegram ID ${item.telegramId}`
        }))}
        value={filters.merchantId !== null ? [filters.merchantId] : []}
        onChange={([merchantId]) => onChange({ merchantId: merchantId ?? null })}
        search={{ value: merchantSearch, onChange: setMerchantSearch, placeholder: t("admin.merchants.searchPlaceholder") }}
        isLoading={merchants.isFetching}
        selectedLabel={merchant?.name}
      />

      {filters.userId !== null && (
        <span className="inline-flex shrink-0 items-center h-10 rounded-full bg-(--color-primary-tint) text-(--color-primary) text-sm font-bold whitespace-nowrap">
          <span className="pl-4 pr-1">{t("admin.orders.filters.buyer", { id: filters.userId })}</span>
          <button
            type="button"
            onClick={() => {
              haptic.light();
              onChange({ userId: null });
            }}
            aria-label={`${t("admin.orders.filters.buyer", { id: filters.userId })}: ${t("select.clear")}`}
            className="flex items-center justify-center size-10 cursor-pointer"
          >
            <X size={16} />
          </button>
        </span>
      )}
    </div>
  );
};
