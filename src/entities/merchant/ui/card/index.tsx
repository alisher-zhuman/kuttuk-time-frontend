import { useTranslation } from 'react-i18next';

import { ChevronRight } from 'lucide-react';

import { formatMoney } from '@shared/helpers';

import type { Merchant } from '../../model/types';

interface Props {
  merchant: Merchant;
}

export const MerchantCard = ({ merchant }: Props) => {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      aria-label={`${merchant.name}, ${t('merchant.from')} ${formatMoney(merchant.minAmount)}`}
      className="w-full bg-(--color-card) rounded-2xl p-3 border border-(--color-line) shadow-xs flex items-center gap-3.5 text-left cursor-pointer"
    >
      <span className="size-12 rounded-xl shrink-0 bg-(--color-primary) flex items-center justify-center text-white text-xl font-extrabold tracking-tight">
        {merchant.monogram}
      </span>

      <span className="flex-1 min-w-0 flex flex-col">
        <span className="text-base font-extrabold tracking-tight text-(--color-ink)">{merchant.name}</span>
        <span className="text-sm text-(--color-slate) font-semibold mt-0.5">{merchant.category}</span>
      </span>

      <span className="text-right shrink-0 flex flex-col">
        <span className="text-xs text-(--color-hint) font-bold">{t('merchant.from')}</span>
        <span className="text-sm text-(--color-primary) font-extrabold">{formatMoney(merchant.minAmount)}</span>
      </span>

      <ChevronRight size={17} strokeWidth={2.4} color="var(--color-hint)" />
    </button>
  );
};
