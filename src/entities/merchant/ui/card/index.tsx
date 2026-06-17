import { useTranslation } from 'react-i18next';

import { ChevronRight } from 'lucide-react';

import { formatMoney } from '@shared/helpers';

import type { Merchant } from '../../model/types';

const GRADIENTS: Record<string, readonly [string, string]> = {
  v1: ['#5A4BE8', '#8B7DFB'],
  v2: ['#FF6B5E', '#FF9486'],
  v3: ['#3B82F6', '#60A5FA'],
  v4: ['#8B5CF6', '#A78BFA'],
  v5: ['#F59E0B', '#FBBF24'],
  v6: ['#14B8A6', '#2DD4BF'],
};

interface Props {
  merchant: Merchant;
}

export const MerchantCard = ({ merchant }: Props) => {
  const { t } = useTranslation();
  const [from, to] = GRADIENTS[merchant.gradient] ?? GRADIENTS.v1;

  return (
    <button
      type="button"
      aria-label={`${merchant.name}, ${t('merchant.from')} ${formatMoney(merchant.minAmount)}`}
      className="w-full bg-(--color-card) rounded-2xl p-3 border border-(--color-line) shadow-xs flex items-center gap-3.5 text-left cursor-pointer"
    >
      <div
        style={{
          width: 50,
          height: 50,
          borderRadius: 14,
          flexShrink: 0,
          background: `linear-gradient(140deg, ${from}, ${to})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 800,
          fontSize: 20,
          letterSpacing: '-0.02em',
        }}
      >
        {merchant.monogram}
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-base font-extrabold tracking-tight text-(--color-ink)">{merchant.name}</div>
        <div className="text-sm text-(--color-slate) font-semibold mt-0.5">{merchant.category}</div>
      </div>

      <div className="text-right shrink-0">
        <div className="text-xs text-(--color-hint) font-bold">{t('merchant.from')}</div>
        <div className="text-sm text-(--color-primary) font-extrabold">{formatMoney(merchant.minAmount)}</div>
      </div>

      <ChevronRight size={17} strokeWidth={2.4} color="var(--color-hint)" />
    </button>
  );
};
