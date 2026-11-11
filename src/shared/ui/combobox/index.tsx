import { useId, useRef, useState } from "react";

import { useTranslation } from "react-i18next";

import { Check, ChevronDown } from "lucide-react";

import { cn } from "@shared/helpers";
import { useHaptic } from "@shared/hooks";

import type { SelectOption } from "../select";

interface Props<V extends string | number> {
  label: string;
  placeholder: string;
  // The chosen one, or null.
  value: V | null;
  // Its name - shown in the field while it isn't being typed in.
  selectedLabel?: string | undefined;
  // What's typed; the caller filters the options by it (the server or locally).
  query: string;
  onQueryChange: (query: string) => void;
  options: SelectOption<V>[];
  onChange: (value: V) => void;
  isLoading?: boolean;
  error?: string | undefined;
}

// A searched pick right on the page: type in the field, the matches open under
// it, a tap picks. Not a sheet - on iPhone the keyboard breaks a fixed bottom
// sheet with an input in it. In the page flow (not floating), so the list stays
// above the keyboard and never gets cut by a card's edge.
export const Combobox = <V extends string | number>({
  label,
  placeholder,
  value,
  selectedLabel,
  query,
  onQueryChange,
  options,
  onChange,
  isLoading = false,
  error
}: Props<V>) => {
  const [isOpen, setIsOpen] = useState(false);

  const { t } = useTranslation();

  const haptic = useHaptic();

  const listId = useId();

  const inputRef = useRef<HTMLInputElement>(null);

  const pick = (option: V) => {
    haptic.selection();
    onChange(option);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-(--color-hint)">{label}</span>

        <span
          className={cn(
            "flex items-center gap-2 min-h-12 px-3.5 rounded-xl border bg-(--color-card)",
            error ? "border-(--color-accent)" : isOpen ? "border-(--color-primary)" : "border-(--color-line)"
          )}
        >
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded={isOpen}
            aria-controls={listId}
            aria-autocomplete="list"
            autoComplete="off"
            // While typing - the query; otherwise the chosen one's name.
            value={isOpen ? query : (selectedLabel ?? "")}
            placeholder={isOpen && selectedLabel ? selectedLabel : placeholder}
            onFocus={() => {
              setIsOpen(true);
              onQueryChange("");
            }}
            onBlur={() => setIsOpen(false)}
            onChange={(event) => onQueryChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape") inputRef.current?.blur();
            }}
            className="flex-1 min-w-0 bg-transparent text-base text-(--color-ink) placeholder:text-(--color-hint) outline-none"
          />
          <ChevronDown
            size={18}
            className={cn("shrink-0 text-(--color-hint) transition-transform", isOpen && "rotate-180")}
          />
        </span>
      </label>

      {isOpen && (
        <ul
          id={listId}
          role="listbox"
          aria-label={label}
          // Keeps the focus in the field: a tap on a row would blur it first and
          // close the list before the tap lands.
          onPointerDown={(event) => event.preventDefault()}
          onMouseDown={(event) => event.preventDefault()}
          className="max-h-64 overflow-y-auto p-1 rounded-xl border border-(--color-line) bg-(--color-card) list-none"
        >
          {options.length === 0 ? (
            <li className="px-3 py-3 text-sm text-(--color-hint)">
              {isLoading ? t("select.loading") : t("select.empty")}
            </li>
          ) : (
            options.map((option) => {
              const isSelected = option.value === value;

              return (
                <li key={option.value} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    onClick={() => pick(option.value)}
                    className="w-full min-h-12 flex items-center gap-3 px-3 py-2 rounded-lg text-left cursor-pointer active:bg-(--color-chip)"
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
      )}

      {error && <span className="text-xs font-semibold text-(--color-accent)">{error}</span>}
    </div>
  );
};
