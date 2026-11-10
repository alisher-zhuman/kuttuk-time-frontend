import { useTranslation } from "react-i18next";

import { OrderList } from "@widgets/orders/order-list";

import { useAdminMerchantQuery } from "@entities/merchant";
import { isOrderStatus } from "@entities/order";
import { useAdminVenueQuery } from "@entities/venue";

import { useDebounce, useSearchParamState } from "@shared/hooks";
import { Input, SearchBar } from "@shared/ui";

const toId = (value: string | null) => (value && /^\d+$/.test(value) ? Number(value) : null);

export const OrderListPage = () => {
  const { t } = useTranslation();

  // Filters live in the URL: the payouts warning links to ?status=needs_review,
  // a venue's / an owner's card to ?venueId= / ?merchantId=, and Back from an
  // order returns to the same filter.
  const [searchParam, setSearch] = useSearchParamState("search");
  const [statusParam, setStatus] = useSearchParamState("status");
  const [venueParam, setVenueParam] = useSearchParamState("venueId");
  const [merchantParam, setMerchantParam] = useSearchParamState("merchantId");
  const [userParam, setUserParam] = useSearchParamState("userId");

  const search = searchParam ?? "";
  const status = isOrderStatus(statusParam) ? statusParam : null;
  const venueId = toId(venueParam);
  const merchantId = toId(merchantParam);
  const debouncedSearch = useDebounce(search);
  const userId = toId(useDebounce(userParam ?? ""));

  // Only for the chip's name; the list doesn't wait for it.
  const { venue } = useAdminVenueQuery(venueId !== null ? String(venueId) : undefined);
  const { merchant } = useAdminMerchantQuery(merchantId !== null ? String(merchantId) : undefined);

  const scope =
    venueId !== null
      ? {
          label: t("admin.orders.scopeVenue", { name: venue?.name ?? `#${venueId}` }),
          onClear: () => setVenueParam(null)
        }
      : merchantId !== null
        ? {
            label: t("admin.orders.scopeMerchant", { name: merchant?.name ?? `#${merchantId}` }),
            onClear: () => setMerchantParam(null)
          }
        : undefined;

  return (
    <>
      <SearchBar
        value={search}
        onChange={(value) => setSearch(value)}
        isLoading={search !== debouncedSearch}
        placeholder={t("admin.orders.searchPlaceholder")}
      />

      {/* The «ID» in the buyer's profile - support asks for it. */}
      <div className="mt-2.5">
        <Input
          aria-label={t("admin.orders.buyerId")}
          placeholder={t("admin.orders.buyerId")}
          inputMode="numeric"
          value={userParam ?? ""}
          onChange={(event) => setUserParam(event.target.value.replace(/\D/g, "") || null)}
        />
      </div>

      <OrderList
        status={status}
        onStatusChange={setStatus}
        search={debouncedSearch.trim()}
        venueId={venueId}
        merchantId={merchantId}
        userId={userId}
        scope={scope}
      />
    </>
  );
};
