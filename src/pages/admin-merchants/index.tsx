import { useSearchParams } from "react-router";

import {
  AdminMerchantList,
  AdminMerchantStatusFilter,
} from "@widgets/admin-merchants";
import { CategoryFilter, SearchBar } from "@widgets/home";

import { useDebounce } from "@shared/hooks";

export const AdminMerchantsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const categoryParam = searchParams.get("category");
  const activeCategory = categoryParam ? Number(categoryParam) : null;
  const isActiveParam = searchParams.get("isActive");
  const activeStatus = isActiveParam === null ? null : isActiveParam === "true";

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
      { replace: true },
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
      />

      <AdminMerchantStatusFilter
        active={activeStatus}
        onChange={(isActive) =>
          setParam("isActive", isActive !== null ? String(isActive) : null)
        }
      />

      <AdminMerchantList
        search={debouncedSearch}
        category={activeCategory}
        isActive={activeStatus}
      />
    </>
  );
};
