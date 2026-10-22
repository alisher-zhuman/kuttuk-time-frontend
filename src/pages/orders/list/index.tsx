import { useTranslation } from "react-i18next";

import { OrderList } from "@widgets/orders/order-list";

import { isOrderStatus } from "@entities/order";

import { useDebounce, useSearchParamState } from "@shared/hooks";
import { SearchBar } from "@shared/ui";

export const OrderListPage = () => {
  const { t } = useTranslation();

  // Filters live in the URL: the payouts warning links to ?status=needs_review,
  // and Back from an order returns to the same filter.
  const [searchParam, setSearch] = useSearchParamState("search");
  const [statusParam, setStatus] = useSearchParamState("status");

  const search = searchParam ?? "";
  const status = isOrderStatus(statusParam) ? statusParam : null;

  const debouncedSearch = useDebounce(search);


  return (
    <>
      <SearchBar
        value={search}
        onChange={(value) => setSearch(value)}
        isLoading={search !== debouncedSearch}
        placeholder={t("admin.orders.searchPlaceholder")}
      />

      <OrderList
        status={status}
        onStatusChange={setStatus}
        search={debouncedSearch.trim()}
      />
    </>
  );
};
