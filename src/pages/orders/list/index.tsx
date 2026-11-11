import { useTranslation } from "react-i18next";

import { OrderList } from "@widgets/orders/order-list";

import { isOrderStatus } from "@entities/order";

import { useDebounce, useSearchParamState } from "@shared/hooks";
import { SearchBar } from "@shared/ui";

const toId = (value: string | null) => (value && /^\d+$/.test(value) ? Number(value) : null);

export const OrderListPage = () => {
  const { t } = useTranslation();

  // Filters live in the URL: the payouts warning links to ?status=needs_review,
  // a venue's / an owner's card to ?venueId= / ?merchantId=, an order's buyer
  // to ?userId=, and Back from an order returns to the same filter.
  const [searchParam, setSearch] = useSearchParamState("search");
  const [statusParam, setStatus] = useSearchParamState("status");
  const [venueParam, setVenue] = useSearchParamState("venueId");
  const [merchantParam, setMerchant] = useSearchParamState("merchantId");
  const [userParam, setUser] = useSearchParamState("userId");

  const search = searchParam ?? "";

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
        search={debouncedSearch.trim()}
        filters={{
          status: isOrderStatus(statusParam) ? statusParam : null,
          venueId: toId(venueParam),
          merchantId: toId(merchantParam),
          userId: toId(userParam)
        }}
        onFiltersChange={(patch) => {
          if ("status" in patch) setStatus(patch.status ?? null);
          if ("venueId" in patch) setVenue(patch.venueId != null ? String(patch.venueId) : null);
          if ("merchantId" in patch) setMerchant(patch.merchantId != null ? String(patch.merchantId) : null);
          if ("userId" in patch) setUser(patch.userId != null ? String(patch.userId) : null);
        }}
      />
    </>
  );
};
