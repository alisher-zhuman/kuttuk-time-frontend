import { useTranslation } from "react-i18next";

import { MerchantList } from "@widgets/merchants/merchant-list";

import { ROUTE_PATTERNS } from "@shared/constants";
import { useDebounce, useNavigateTo, useSearchParamState } from "@shared/hooks";
import { ActiveFilter, SearchBar } from "@shared/ui";

export const MerchantListPage = () => {
  const { t } = useTranslation();

  const navigateTo = useNavigateTo();

  const [searchParam, setSearch] = useSearchParamState("search");
  const [isActiveParam, setIsActive] = useSearchParamState("isActive");

  const search = searchParam ?? "";
  const activeStatus = isActiveParam !== "false";

  const debouncedSearch = useDebounce(search);


  return (
    <>
      <SearchBar
        value={search}
        onChange={(value) => setSearch(value)}
        isLoading={search !== debouncedSearch}
        placeholder={t("admin.merchants.searchPlaceholder")}
      />

      <ActiveFilter
        active={activeStatus}
        onChange={(isActive) => setIsActive(String(isActive))}
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
