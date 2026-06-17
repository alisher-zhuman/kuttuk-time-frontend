import { useState } from 'react';

import { CategoryFilter, MerchantList, SearchBar } from '@widgets/home';
import { Header } from '@widgets/layout';

export const HomePage = () => {
  const [activeCategory, setActiveCategory] = useState('Все');

  return (
    <div className="min-h-dvh bg-(--color-bg) text-(--color-ink)">
      <Header />

      <main>
        <div className="px-4 pt-3.5">
          <SearchBar />
          <CategoryFilter active={activeCategory} onChange={setActiveCategory} />
        </div>

        <MerchantList category={activeCategory} />
      </main>
    </div>
  );
};
