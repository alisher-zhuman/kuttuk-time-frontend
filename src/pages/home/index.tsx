import { useState } from "react";

import { CategoryFilter, MerchantList, SearchBar } from "@widgets/home";

import { useDebounce } from "@shared/hooks";

export const HomePage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search);

  return (
    <>
      <SearchBar value={search} onChange={setSearch} />

      <CategoryFilter active={activeCategory} onChange={setActiveCategory} />

      <MerchantList category={activeCategory} search={debouncedSearch} />
    </>
  );
};
