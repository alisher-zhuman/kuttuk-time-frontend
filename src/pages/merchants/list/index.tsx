import { useSearchParams } from "react-router";

import { useTranslation } from "react-i18next";

import { MerchantList } from "@widgets/merchants/merchant-list";

import { ROUTE_PATTERNS } from "@shared/constants";
import { useDebounce, useNavigateTo } from "@shared/hooks";
import { ActiveFilter, SearchBar } from "@shared/ui";

export const MerchantListPage = () => {
  const { t } = useTranslation();

  const navigateTo = useNavigateTo();

  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const activeStatus = searchParams.get("isActive") !== "false";

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
        placeholder={t("admin.merchants.searchPlaceholder")}
      />

      <ActiveFilter
        active={activeStatus}
        onChange={(isActive) => setParam("isActive", String(isActive))}
        onCreate={() => navigateTo(ROUTE_PATTERNS.ADMIN_MERCHANT_CREATE)}
        labels={{
          active: t("admin.venues.active"),
          inactive: t("admin.venues.inactive"),
          create: t("merchantForm.title")
        }}
      />

      <MerchantList search={debouncedSearch} isActive={activeStatus} />
    </>
  );
};
