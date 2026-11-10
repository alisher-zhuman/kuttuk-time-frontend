import { useTranslation } from "react-i18next";

import { ClipboardList, SearchX, X } from "lucide-react";

import {
  isAdminOrderSearchError,
  ORDER_STATUSES,
  type OrderStatus,
  useAdminOrdersQuery
} from "@entities/order";

import { getAdminOrderDetailRoute } from "@shared/constants";
import { useHaptic, useLoadMoreOnScroll, useNavigateTo } from "@shared/hooks";
import { ChipSelect, EmptyState, ErrorState, LoadMore } from "@shared/ui";

import { OrderRow } from "../order-row";

// «На проверке» first - the queue to watch; the rest in the backend's order.
const STATUSES = [
  "all",
  "needs_review",
  ...ORDER_STATUSES.filter((status) => status !== "needs_review")
] as const;

interface Props {
  status: OrderStatus | null;
  onStatusChange: (status: OrderStatus | null) => void;
  search: string;
  venueId: number | null;
  merchantId: number | null;
  userId: number | null;
  // «Заведение: Coffeeroom» / «Владелец: …» while one is picked, with a way out.
  scope?: { label: string; onClear: () => void } | undefined;
}

export const OrderList = ({
  status,
  onStatusChange,
  search,
  venueId,
  merchantId,
  userId,
  scope
}: Props) => {
  const { t } = useTranslation();

  const navigateTo = useNavigateTo();

  const haptic = useHaptic();

  const {
    orders,
    error,
    isLoading,
    isError,
    isFetching,
    isFetchingNextPage,
    isLoadMoreError,
    hasNextPage,
    fetchNextPage,
    retry
  } = useAdminOrdersQuery({ status, search, venueId, merchantId, userId });

  const setSentinel = useLoadMoreOnScroll(
    fetchNextPage,
    // Stop on a failed page - the footer's retry takes over.
    hasNextPage && !isFetchingNextPage && !isLoadMoreError
  );

  return (
    <div className="flex flex-col gap-4 mt-3.5 pb-5">
      {scope && (
        <button
          type="button"
          onClick={() => {
            haptic.light();
            scope.onClear();
          }}
          aria-label={`${scope.label} - ${t("admin.orders.clearScope")}`}
          className="self-start max-w-full flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-(--color-primary-tint) text-(--color-primary) text-sm font-bold cursor-pointer"
        >
          <span className="truncate">{scope.label}</span>
          <X size={14} className="shrink-0" />
        </button>
      )}

      <ChipSelect
        items={STATUSES.map((value) => ({
          value,
          label: value === "all" ? t("admin.orders.all") : t(`admin.orders.status.${value}`)
        }))}
        isSelected={(value) => value === (status ?? "all")}
        onSelect={(value) => onStatusChange(value === "all" ? null : value)}
      />

      {isLoading ? (
        <ul className="flex flex-col gap-2.5 list-none">
          {Array.from({ length: 4 }).map((_, i) => (
            <li key={i} className="h-24 rounded-2xl bg-(--color-chip) animate-pulse" />
          ))}
        </ul>
      ) : isError && isAdminOrderSearchError(error) ? (
        // 400 = the search is neither a certificate code nor an order id.
        <EmptyState
          icon={<SearchX size={32} strokeWidth={1.5} />}
          message={t("admin.orders.searchInvalid")}
        />
      ) : isError ? (
        <ErrorState onRetry={retry} isRetrying={isFetching} />
      ) : orders.length === 0 ? (
        <EmptyState
          icon={<ClipboardList size={32} strokeWidth={1.5} />}
          message={t("admin.orders.empty")}
        />
      ) : (
        <ul className="flex flex-col gap-2.5 list-none">
          {orders.map((order) => (
            <li key={order.id}>
              <OrderRow
                order={order}
                onOpen={() => {
                  haptic.light();
                  navigateTo(getAdminOrderDetailRoute(order.id));
                }}
              />
            </li>
          ))}

          <LoadMore
            sentinelRef={setSentinel}
            isLoading={isFetchingNextPage}
            isError={isLoadMoreError}
            onRetry={fetchNextPage}
          />
        </ul>
      )}
    </div>
  );
};
