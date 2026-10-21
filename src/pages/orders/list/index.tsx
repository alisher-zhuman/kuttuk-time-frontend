import { useSearchParams } from "react-router";

import { useTranslation } from "react-i18next";

import { OrderList } from "@widgets/orders/order-list";

import { type OrderStatus } from "@entities/order";

import { useDebounce } from "@shared/hooks";
import { SearchBar } from "@shared/ui";

const STATUSES: OrderStatus[] = ["pending", "paid", "expired", "needs_review", "refunded"];

export const OrderListPage = () => {
  const { t } = useTranslation();

  // Filters live in the URL: the payouts warning links to ?status=needs_review,
  // and Back from an order returns to the same filter.
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const statusParam = searchParams.get("status") as OrderStatus | null;
  const status = statusParam && STATUSES.includes(statusParam) ? statusParam : null;

  const debouncedSearch = useDebounce(search);

  const setParam = (key: string, value: string | null) => {
    setSearchParams(
      (prev) => {
        if (value !== null) {
          prev.set(key, value);
        } else {
          prev.delete(key);
        }

        return prev;
      },
      { replace: true }
    );
  };

  return (
    <>
      <SearchBar
        value={search}
        onChange={(value) => setParam("search", value || null)}
        isLoading={search !== debouncedSearch}
        placeholder={t("admin.orders.searchPlaceholder")}
      />

      <OrderList
        status={status}
        onStatusChange={(next) => setParam("status", next)}
        search={debouncedSearch.trim()}
      />
    </>
  );
};
