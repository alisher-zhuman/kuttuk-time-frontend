import { useTranslation } from 'react-i18next';

import { Search } from 'lucide-react';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar = ({ value, onChange }: Props) => {
  const { t } = useTranslation();

  return (
    <label className="w-full flex items-center gap-2.5 h-10 px-3.5 bg-(--color-field) rounded-xl text-(--color-hint) border border-(--color-line)">
      <Search size={19} strokeWidth={2.2} color="var(--color-hint)" />
      
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('search.placeholder')}
        className="flex-1 bg-transparent text-base font-semibold text-(--color-ink) placeholder:text-(--color-hint) outline-none"
      />
    </label>
  );
};
