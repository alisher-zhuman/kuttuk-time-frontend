import { useState } from "react";

import { CategoryFilter, MerchantList, SearchBar } from "@widgets/home";

export const HomePage = () => {
  const [activeCategory, setActiveCategory] = useState("Все");
  const [search, setSearch] = useState("");

  return (
    <main>
      <SearchBar value={search} onChange={setSearch} />

      <CategoryFilter active={activeCategory} onChange={setActiveCategory} />

      <MerchantList category={activeCategory} search={search} />
    </main>
  );
};
