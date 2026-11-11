import { useState } from "react";

import { useTranslation } from "react-i18next";

import { Check, ChevronDown, Loader2, Search, X } from "lucide-react";

import { cn } from "@shared/helpers";
import { useHaptic } from "@shared/hooks";

import { BottomSheet } from "../bottom-sheet";

export interface SelectOption<V extends string | number> {
  value: V;
  label: string;
  // A second line: «Telegram ID 123456789».
  hint?: string;
}

interface Props<V extends string | number> {
  // The field's label and the sheet's title.
  label: string;
  // What an empty field says.
  placeholder: string;
  options: SelectOption<V>[];
  // Always a list: [] - nothing, [v] - one (unless `multiple`).
  value: V[];
  onChange: (value: V[]) => void;
  multiple?: boolean;
  // field - full width in a form; filter - a pill in a filter row.
  variant?: "field" | "filter";
  // A × that resets to nothing (filters).
  clearable?: boolean;
  // A search box in the sheet; the caller filters the options (the server or
  // locally) and passes the result.
  search?: { value: string; onChange: (value: string) => void; placeholder: string } | undefined;
  isLoading?: boolean;
  // The name of a chosen value that isn't among the options right now (a
  // server search narrowed them) - else the trigger would show nothing.
  selectedLabel?: string | undefined;
  error?: string | undefined;
}

// One picker for lists: a field or a filter pill opens a bottom sheet with
// big rows (48 px), an optional search, one or many choices. Instead of chip
// rows that don't fit a 320 px screen once there are a dozen values.
export const Select = <V extends string | number>({
  label,
  placeholder,
  options,
  value,
  onChange,
  multiple = false,
  variant = "field",
  clearable = false,
  search,
  isLoading = false,
  selectedLabel,
  error
}: Props<V>) => {
  const [isOpen, setIsOpen] = useState(false);

  const { t } = useTranslation();

  const haptic = useHaptic();

  const labelOf = (item: V) => options.find((option) => option.value === item)?.label ?? selectedLabel ?? String(item);

  const shown = value.map(labelOf);

  const open = () => {
    haptic.light();
    setIsOpen(true);
  };

  const clear = () => {
    haptic.light();
    onChange([]);
  };

  const toggle = (item: V) => {
    haptic.selection();
    onChange(value.includes(item) ? value.filter((selected) => selected !== item) : [...value, item]);
  };

  const trigger =
    variant === "filter" ? (
      <span
        className={cn(
          "inline-flex shrink-0 items-center max-w-64 h-10 rounded-full border text-sm font-bold whitespace-nowrap",
          value.length > 0
            ? "bg-(--color-primary-tint) border-transparent text-(--color-primary)"
            : "bg-(--color-chip) border-(--color-line) text-(--color-chip-ink)"
        )}
      >
        <button
          type="button"
          onClick={open}
          aria-haspopup="dialog"
          className="flex items-center gap-1 min-w-0 h-full pl-4 pr-3 cursor-pointer"
        >
          <span className="truncate">{value.length > 0 ? `${label}: ${shown.join(", ")}` : label}</span>
          {!(clearable && value.length > 0) && <ChevronDown size={16} className="shrink-0" />}
        </button>

        {clearable && value.length > 0 && (
          <button
            type="button"
            onClick={clear}
            aria-label={`${label}: ${t("select.clear")}`}
            className="flex items-center justify-center size-10 shrink-0 -ml-2 cursor-pointer"
          >
            <X size={16} />
          </button>
        )}
      </span>
    ) : (
      <span className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-(--color-hint)">{label}</span>

        <button
          type="button"
          onClick={open}
          aria-haspopup="dialog"
          aria-label={value.length > 0 ? `${label}: ${shown.join(", ")}` : label}
          className={cn(
            "w-full min-h-12 flex items-center gap-2 px-3.5 py-2 rounded-xl border bg-(--color-card) text-left cursor-pointer",
            error ? "border-(--color-accent)" : "border-(--color-line)"
          )}
        >
          <span className="flex-1 min-w-0 flex flex-wrap gap-1.5">
            {value.length === 0 ? (
              <span className="text-base text-(--color-hint)">{placeholder}</span>
            ) : multiple ? (
              shown.map((text) => (
                <span
                  key={text}
                  className="px-2.5 py-1 rounded-full bg-(--color-primary-tint) text-(--color-primary) text-sm font-bold"
                >
                  {text}
                </span>
              ))
            ) : (
              <span className="text-base text-(--color-ink) wrap-break-word">{shown[0]}</span>
            )}
          </span>

          <ChevronDown size={18} className="shrink-0 text-(--color-hint)" />
        </button>

        {error && <span className="text-xs font-semibold text-(--color-accent)">{error}</span>}
      </span>
    );

  return (
    <>
      {trigger}

      {isOpen && (
        <BottomSheet title={label} onClose={() => setIsOpen(false)}>
          {(close) => (
            <>
              {search && (
                <label className="flex items-center gap-2.5 h-12 px-4 bg-(--color-field) rounded-xl border border-(--color-line)">
                  {isLoading ? (
                    <Loader2 size={18} className="animate-spin shrink-0 text-(--color-hint)" />
                  ) : (
                    <Search size={18} className="shrink-0 text-(--color-hint)" />
                  )}
                  <input
                    type="search"
                    value={search.value}
                    onChange={(event) => search.onChange(event.target.value)}
                    placeholder={search.placeholder}
                    aria-label={search.placeholder}
                    className="flex-1 min-w-0 bg-transparent text-base text-(--color-ink) placeholder:text-(--color-hint) outline-none"
                  />
                </label>
              )}

              <ul role="listbox" aria-label={label} aria-multiselectable={multiple} className="max-h-96 overflow-y-auto -mx-1 list-none">
                {options.length === 0 ? (
                  <li className="px-1 py-4 text-sm text-(--color-hint) text-center">
                    {isLoading ? t("select.loading") : t("select.empty")}
                  </li>
                ) : (
                  options.map((option) => {
                    const isSelected = value.includes(option.value);

                    return (
                      <li key={option.value} role="option" aria-selected={isSelected}>
                        <button
                          type="button"
                          onClick={() => {
                            if (multiple) {
                              toggle(option.value);
                              return;
                            }

                            haptic.selection();
                            onChange([option.value]);
                            close();
                          }}
                          className="w-full min-h-12 flex items-center gap-3 px-3 py-2 rounded-xl text-left cursor-pointer active:bg-(--color-chip)"
                        >
                          <span className="flex-1 min-w-0 flex flex-col">
                            <span
                              className={cn(
                                "text-base wrap-break-word",
                                isSelected ? "font-bold text-(--color-primary)" : "text-(--color-ink)"
                              )}
                            >
                              {option.label}
                            </span>
                            {option.hint && <span className="text-xs text-(--color-hint)">{option.hint}</span>}
                          </span>

                          {isSelected && <Check size={18} className="shrink-0 text-(--color-primary)" />}
                        </button>
                      </li>
                    );
                  })
                )}
              </ul>

              {multiple && (
                <button
                  type="button"
                  onClick={close}
                  className="py-3 rounded-2xl bg-(--color-primary) text-(--color-card) text-sm font-bold cursor-pointer"
                >
                  {t("select.done")}
                </button>
              )}
            </>
          )}
        </BottomSheet>
      )}
    </>
  );
};
