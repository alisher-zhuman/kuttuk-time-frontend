import { useState } from 'react';

import { Header } from '@widgets/layout';

import { CATEGORIES } from '@entities/category';
import { MERCHANTS } from '@entities/merchant';

import { cn, formatMoney } from '@shared/helpers';
import { Icon } from '@shared/ui/icon';
import { Mono } from '@shared/ui/mono';

export const HomePage = () => {
  const [activeCategory, setActiveCategory] = useState<string>('Все');

  return (
    <div className="min-h-dvh bg-(--color-bg) text-(--color-ink)">
      <Header />

      <div>
        <div className="px-4 pt-3.5">
          {/* Search */}
          <div className="flex items-center gap-2.5 h-10 px-3.5 bg-(--color-field) rounded-xl text-(--color-hint) border border-(--color-line)">
            <Icon name="search" size={19} strokeWidth={2.2} color="var(--color-hint)" />
            <span className="text-base font-semibold">Поиск заведений</span>
          </div>

          {/* Category chips */}
          <div className="flex gap-2 mt-3.5 overflow-x-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'px-3.75 py-2 rounded-full text-sm font-bold whitespace-nowrap shrink-0 cursor-pointer',
                  activeCategory === cat
                    ? 'bg-(--color-primary) text-white border-none'
                    : 'bg-(--color-chip) text-(--color-chip-ink) border border-(--color-line)',
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Section label */}
          <div className="text-xs font-bold text-(--color-hint) tracking-wider pt-5.5 pb-2.5 px-1">
            ЗАВЕДЕНИЯ
          </div>
        </div>

        {/* Merchant list */}
        <div className="px-4 pb-5 flex flex-col gap-2.5">
          {MERCHANTS.map((merchant) => (
            <div
              key={merchant.id}
              className="bg-(--color-card) rounded-2xl p-3 border border-(--color-line) shadow-xs flex items-center gap-3.5 cursor-pointer"
            >
              <Mono gradient={merchant.gradient} label={merchant.monogram} size={50} radius={14} />

              <div className="flex-1 min-w-0">
                <div className="text-base font-extrabold tracking-tight text-(--color-ink)">
                  {merchant.name}
                </div>
                <div className="text-sm text-(--color-slate) font-semibold mt-0.5">
                  {merchant.category}
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-xs text-(--color-hint) font-bold">от</div>
                <div className="text-sm text-(--color-primary) font-extrabold">
                  {formatMoney(merchant.minAmount)}
                </div>
              </div>

              <Icon name="chevron" size={17} strokeWidth={2.4} color="var(--color-hint)" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
