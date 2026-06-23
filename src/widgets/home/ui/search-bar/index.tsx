import { useTranslation } from "react-i18next";

import { Loader2, Search, X } from "lucide-react";

import { useHaptic } from "@shared/hooks";

interface Props {
  value: string;
  onChange: (value: string) => void;
  isLoading?: boolean;
}

export const SearchBar = ({ value, onChange, isLoading }: Props) => {
  const { t } = useTranslation();

  const haptic = useHaptic();

  return (
    <label className="mt-3.5 flex items-center gap-2.5 h-10 px-4.5 bg-(--color-field) rounded-xl text-(--color-hint) border border-(--color-line)">
      {isLoading ? (
        <Loader2 size={19} color="var(--color-hint)" className="animate-spin shrink-0" />
      ) : (
        <Search size={19} color="var(--color-hint)" />
      )}

      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t("search.placeholder")}
        className="flex-1 bg-transparent text-base font-semibold text-(--color-ink) placeholder:text-(--color-hint) outline-none caret-(--color-primary)"
      />

      <button
        type="button"
        aria-label={t("search.clear")}
        onClick={() => { haptic.light(); onChange(""); }}
        className={`shrink-0 cursor-pointer transition-all duration-150 ${value ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"}`}
      >
        <X size={17} color="var(--color-hint)" />
      </button>
    </label>
  );
};
