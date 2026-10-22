import { VenueList } from "@widgets/home";

import { CategoryFilter } from "@features/category-filter";

import { useDebounce, useSearchParamState } from "@shared/hooks";
import { SearchBar } from "@shared/ui";

export const HomePage = () => {
  const [searchParam, setSearch] = useSearchParamState("search");
  const [categoryParam, setCategory] = useSearchParamState("category");

  const search = searchParam ?? "";
  const categoryId = Number(categoryParam);
  const activeCategory = Number.isInteger(categoryId) && categoryId > 0 ? categoryId : null;

  const debouncedSearch = useDebounce(search);

  return (
    <>
      <SearchBar
        value={search}
        onChange={setSearch}
        isLoading={search !== debouncedSearch}
      />

      <CategoryFilter
        active={activeCategory}
        onChange={(category) => setCategory(category !== null ? String(category) : null)}
      />

      <VenueList category={activeCategory} search={debouncedSearch} />
    </>
  );
};
