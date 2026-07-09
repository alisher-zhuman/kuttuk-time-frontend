import { useState } from "react";

import { useTranslation } from "react-i18next";

import { Plus, X } from "lucide-react";

import { formatMoney } from "@shared/helpers";
import { useHaptic } from "@shared/hooks";
import { Input } from "@shared/ui";

import { NOMINAL_MAX, NOMINAL_MIN } from "../../model/schemas";

interface Props {
  value: number[];
  onChange: (nominals: number[]) => void;
  error?: string | undefined;
}

export const NominalInput = ({ value, onChange, error }: Props) => {
  const [draft, setDraft] = useState("");
  const [draftError, setDraftError] = useState<string | null>(null);

  const { t } = useTranslation();

  const haptic = useHaptic();

  const add = () => {
    const parsed = Number(draft.trim());

    if (
      !Number.isInteger(parsed) ||
      parsed < NOMINAL_MIN ||
      parsed > NOMINAL_MAX
    ) {
      haptic.error();
      setDraftError(
        t("admin.merchants.form.nominalRange", {
          min: NOMINAL_MIN,
          max: NOMINAL_MAX
        })
      );
      return;
    }

    if (value.includes(parsed)) {
      haptic.error();
      setDraftError(t("admin.merchants.form.nominalDuplicate"));
      return;
    }

    haptic.selection();
    setDraftError(null);
    setDraft("");
    onChange([...value, parsed].sort((a, b) => a - b));
  };

  const remove = (nominal: number) => {
    haptic.selection();
    onChange(value.filter((item) => item !== nominal));
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Input
            type="number"
            inputMode="numeric"
            label={t("admin.merchants.form.nominals")}
            placeholder={t("admin.merchants.form.nominalPlaceholder")}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
          />
        </div>

        <button
          type="button"
          onClick={add}
          aria-label={t("admin.merchants.form.addNominal")}
          className="shrink-0 size-11 rounded-xl bg-(--color-primary) text-(--color-card) flex items-center justify-center cursor-pointer"
        >
          <Plus size={20} />
        </button>
      </div>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((nominal) => (
            <span
              key={nominal}
              className="flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full text-sm font-bold bg-(--color-chip) text-(--color-chip-ink) border border-(--color-line)"
            >
              {formatMoney(nominal, t("certificate.currency"))}

              <button
                type="button"
                onClick={() => remove(nominal)}
                aria-label={t("admin.merchants.form.removeNominal")}
                className="text-(--color-hint) cursor-pointer"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      )}

      {(draftError ?? error) && (
        <span className="text-xs font-semibold text-(--color-accent)">
          {draftError ?? error}
        </span>
      )}
    </div>
  );
};
