import { useTranslation } from 'react-i18next';

import { formatMoney } from '@shared/helpers';
import { Icon, Mono } from '@shared/ui';

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
      <Mono gradient={merchant.gradient} label={merchant.monogram} size={50} radius={14} />

      <div className="flex-1 min-w-0">
        <div className="text-base font-extrabold tracking-tight text-(--color-ink)">{merchant.name}</div>
        <div className="text-sm text-(--color-slate) font-semibold mt-0.5">{merchant.category}</div>
      </div>

      <div className="text-right shrink-0">
        <div className="text-xs text-(--color-hint) font-bold">{t('merchant.from')}</div>
        <div className="text-sm text-(--color-primary) font-extrabold">{formatMoney(merchant.minAmount)}</div>
      </div>

      <Icon name="chevron" size={17} strokeWidth={2.4} color="var(--color-hint)" />
    </button>
  );
};
