import { useTranslation } from "react-i18next";

import { VenueList } from "@widgets/venues/venue-list";

import { CategoryFilter } from "@features/category-filter";

import { ROUTE_PATTERNS } from "@shared/constants";
import { useDebounce, useNavigateTo, useSearchParamState } from "@shared/hooks";
import { ActiveFilter, SearchBar } from "@shared/ui";

export const VenueListPage = () => {
  const { t } = useTranslation();

  const navigateTo = useNavigateTo();

  const [searchParam, setSearch] = useSearchParamState("search");
  const [categoryParam, setCategory] = useSearchParamState("category");
  const [isActiveParam, setIsActive] = useSearchParamState("isActive");

  const search = searchParam ?? "";
  const activeCategory = categoryParam ? Number(categoryParam) : null;
  const activeStatus = isActiveParam !== "false";

  const debouncedSearch = useDebounce(search);


  return (
    <>
      <SearchBar
        value={search}
        onChange={(value) => setSearch(value)}
        isLoading={search !== debouncedSearch}
      />

      <CategoryFilter
        active={activeCategory}
        onChange={(category) =>
          setCategory(category !== null ? String(category) : null)
        }
        onManage={() => navigateTo(ROUTE_PATTERNS.ADMIN_CATEGORIES)}
      />

      <ActiveFilter
        active={activeStatus}
        onChange={(isActive) => setIsActive(String(isActive))}
        onCreate={() => navigateTo(ROUTE_PATTERNS.ADMIN_VENUE_CREATE)}
        labels={{
          active: t("admin.venues.active"),
          inactive: t("admin.venues.inactive"),
          create: t("venueForm.title")
        }}
      />

      <VenueList search={debouncedSearch} category={activeCategory} isActive={activeStatus} />
    </>
  );
};
