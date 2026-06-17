import { useTranslation } from "react-i18next";

import { Icon } from "@shared/ui";

export const SearchBar = () => {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      aria-label={t('search.placeholder')}
      className="w-full flex items-center gap-2.5 h-10 px-3.5 bg-(--color-field) rounded-xl text-(--color-hint) border border-(--color-line)"
    >
      <Icon name="search" size={19} strokeWidth={2.2} color="var(--color-hint)" />
      <span className="text-base font-semibold">{t('search.placeholder')}</span>
    </button>
  );
};
