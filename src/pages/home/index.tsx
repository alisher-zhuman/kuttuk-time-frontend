import { useSearchParams } from "react-router";

import { MerchantList } from "@widgets/home";

import { CategoryFilter } from "@features/category-filter";

import { useDebounce } from "@shared/hooks";
import { SearchBar } from "@shared/ui";

export const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const categoryParam = searchParams.get("category");
  const activeCategory = categoryParam ? Number(categoryParam) : null;

  const debouncedSearch = useDebounce(search);

  const handleSearchChange = (value: string) => {
    setSearchParams(
      (prev) => {
        if (value) {
          prev.set("search", value);
        } else {
          prev.delete("search");
        }

        return prev;
      },
      { replace: true }
    );
  };

  const handleCategoryChange = (category: number | null) => {
    setSearchParams(
      (prev) => {
        if (category !== null) {
          prev.set("category", String(category));
        } else {
          prev.delete("category");
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
        onChange={handleSearchChange}
        isLoading={search !== debouncedSearch}
      />

      <CategoryFilter active={activeCategory} onChange={handleCategoryChange} />

      <MerchantList category={activeCategory} search={debouncedSearch} />
    </>
  );
};
