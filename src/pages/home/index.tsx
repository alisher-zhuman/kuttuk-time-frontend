import { useState } from 'react';

import { viewport } from '@tma.js/sdk-react';

import { CategoryFilter, MerchantList, SearchBar } from '@widgets/home';
import { Header } from '@widgets/layout';

export const HomePage = () => {
  const [activeCategory, setActiveCategory] = useState('Все');
  const [search, setSearch] = useState('');
  const contentSafeAreaInsets = viewport.contentSafeAreaInsets();

  return (
    <div
      className="min-h-dvh bg-(--color-bg) text-(--color-ink)"
      style={{
        paddingTop: contentSafeAreaInsets.top,
        paddingRight: contentSafeAreaInsets.right,
        paddingBottom: contentSafeAreaInsets.bottom,
        paddingLeft: contentSafeAreaInsets.left,
      }}
    >
      <Header />

      <main>
        <div>
          <SearchBar value={search} onChange={setSearch} />
          <CategoryFilter active={activeCategory} onChange={setActiveCategory} />
        </div>

        <MerchantList category={activeCategory} search={search} />
      </main>
    </div>
  );
};
