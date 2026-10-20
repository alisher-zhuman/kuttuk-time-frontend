import { useSearchParams } from "react-router";

import { useTranslation } from "react-i18next";

import { VenueList } from "@widgets/venues/venue-list";

import { CategoryFilter } from "@features/category-filter";

import { ROUTE_PATTERNS } from "@shared/constants";
import { useDebounce, useNavigateTo } from "@shared/hooks";
import { ActiveFilter, SearchBar } from "@shared/ui";

export const VenueListPage = () => {
  const { t } = useTranslation();

  const navigateTo = useNavigateTo();

  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const categoryParam = searchParams.get("category");
  const activeCategory = categoryParam ? Number(categoryParam) : null;
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
      />

      <CategoryFilter
        active={activeCategory}
        onChange={(category) =>
          setParam("category", category !== null ? String(category) : null)
        }
        onManage={() => navigateTo(ROUTE_PATTERNS.ADMIN_CATEGORIES)}
      />

      <ActiveFilter
        active={activeStatus}
        onChange={(isActive) => setParam("isActive", String(isActive))}
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
