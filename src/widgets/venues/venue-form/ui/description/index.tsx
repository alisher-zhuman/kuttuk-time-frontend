import { useState } from "react";

import { useTranslation } from "react-i18next";

import { type Control, type FieldErrors, type UseFormRegister, useWatch } from "react-hook-form";

import { Check } from "lucide-react";

import { cn } from "@shared/helpers";
import { useHaptic } from "@shared/hooks";
import { Textarea } from "@shared/ui";

import type { VenueFormValues } from "../../model/types";

interface Props {
  register: UseFormRegister<VenueFormValues>;
  control: Control<VenueFormValues>;
  errors: FieldErrors<VenueFormValues>;
  // Bumps on every «Сохранить» - the moment to show a missing language.
  submitCount: number;
}

const LANGS = [
  { code: "ru", field: "descriptionRu", label: "RU", nameKey: "venueForm.descriptionRu" },
  { code: "kg", field: "descriptionKg", label: "KG", nameKey: "venueForm.descriptionKg" },
  { code: "en", field: "descriptionEn", label: "EN", nameKey: "venueForm.descriptionEn" }
] as const;

type Lang = (typeof LANGS)[number];

// One field with RU | KG | EN above it instead of three tall ones. All three
// are still required: a tab shows ✓ once its language is filled, and a save
// with one missing marks its tab red and switches to it.
export const VenueFormDescription = ({ register, control, errors, submitCount }: Props) => {
  const [active, setActive] = useState<Lang["code"]>("ru");
  const [seenSubmitCount, setSeenSubmitCount] = useState(submitCount);

  const { t } = useTranslation();

  const haptic = useHaptic();

  const values = useWatch({ control, name: ["descriptionRu", "descriptionKg", "descriptionEn"] });

  const missing = LANGS.filter((lang) => errors[lang.field]);

  // After a save only (a new submitCount) - switching while typing would pull
  // the person away. Adjusted during render, as React advises for state that
  // follows a prop.
  if (submitCount !== seenSubmitCount) {
    setSeenSubmitCount(submitCount);

    const first = missing[0];

    if (first && !missing.some((lang) => lang.code === active)) setActive(first.code);
  }

  const activeLang = LANGS.find((lang) => lang.code === active)!;
  const error = errors[activeLang.field]?.message;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-(--color-hint)">{t("venueForm.description")}</span>

        <div role="tablist" className="flex gap-1 p-1 rounded-xl bg-(--color-surface)">
          {LANGS.map((lang, index) => {
            const isActive = lang.code === active;
            const isMissing = missing.some((item) => item.code === lang.code);
            const isFilled = Boolean(values[index]?.trim());

            return (
              <button
                key={lang.code}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={t(lang.nameKey)}
                onClick={() => {
                  haptic.selection();
                  setActive(lang.code);
                }}
                className={cn(
                  "flex items-center gap-1 min-h-11 px-3 rounded-lg text-xs font-bold cursor-pointer transition-colors",
                  isActive ? "bg-(--color-card) text-(--color-ink) shadow-sm" : "text-(--color-slate)",
                  isMissing && "text-(--color-accent)"
                )}
              >
                {lang.label}
                {isFilled && !isMissing && <Check size={12} className="text-(--color-green)" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Only the active language's field is mounted; react-hook-form keeps
          the others' values. */}
      <Textarea
        key={activeLang.field}
        aria-label={t(activeLang.nameKey)}
        placeholder={t("venueForm.descriptionPlaceholder")}
        error={error && t(error)}
        {...register(activeLang.field)}
      />
    </div>
  );
};
