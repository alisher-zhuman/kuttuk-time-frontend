import { useState } from "react";

import { useSignal, viewport } from "@tma.js/sdk-react";

import { CategoryFilter, MerchantList, SearchBar } from "@widgets/home";
import { Header } from "@widgets/layout";

export const HomePage = () => {
  const [activeCategory, setActiveCategory] = useState("Все");
  const [search, setSearch] = useState("");

  const contentSafeAreaInsets = useSignal(viewport.contentSafeAreaInsets);
  const safeAreaInsets = useSignal(viewport.safeAreaInsets);

  return (
    <div
      className="min-h-dvh bg-(--color-bg) text-(--color-ink)"
      style={{
        paddingTop: safeAreaInsets.top + contentSafeAreaInsets.top,
        paddingRight: safeAreaInsets.right + contentSafeAreaInsets.right,
        paddingBottom: safeAreaInsets.bottom + contentSafeAreaInsets.bottom,
        paddingLeft: safeAreaInsets.left + contentSafeAreaInsets.left,
      }}
    >
      <Header />

      <main>
        <SearchBar value={search} onChange={setSearch} />

        <CategoryFilter active={activeCategory} onChange={setActiveCategory} />

        <MerchantList category={activeCategory} search={search} />
      </main>
    </div>
  );
};
