import { Icon } from "@shared/ui/icon";

export const SearchBar = () => (
  <button
    type="button"
    aria-label="Поиск заведений"
    className="w-full flex items-center gap-2.5 h-10 px-3.5 bg-(--color-field) rounded-xl text-(--color-hint) border border-(--color-line)"
  >
    <Icon name="search" size={19} strokeWidth={2.2} color="var(--color-hint)" />
    <span className="text-base font-semibold">Поиск заведений</span>
  </button>
);
