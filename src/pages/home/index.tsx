import { useState } from "react";

import { CategoryFilter, MerchantList, SearchBar } from "@widgets/home";

export const HomePage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  return (
    <>
      <SearchBar value={search} onChange={setSearch} />

      <CategoryFilter active={activeCategory} onChange={setActiveCategory} />

      <MerchantList category={activeCategory} search={search} />
    </>
  );
};
