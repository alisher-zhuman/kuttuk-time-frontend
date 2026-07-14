import { useTranslation } from "react-i18next";

import { Pencil } from "lucide-react";

import { useHaptic } from "@shared/hooks";
import { StatusBadge } from "@shared/ui";

interface Props {
  logo: string;
  name: string;
  slug: string;
  isActive: boolean;
  // Optional: the merchant's own read-only view omits it, so no pencil is shown.
  onEdit?: (() => void) | undefined;
}

export const MerchantDetailHeader = ({ logo, name, slug, isActive, onEdit }: Props) => {
  const { t } = useTranslation();

  const haptic = useHaptic();

  return (
    <div className="flex items-center gap-3.5">
      <img src={logo} alt={name} className="size-16 rounded-xl shrink-0 object-cover" />

      <div className="flex-1 flex flex-col min-w-0 gap-1">
        <span className="text-xl font-extrabold tracking-tight text-(--color-ink) leading-tight truncate">
          {name}
        </span>
        <span className="text-sm text-(--color-slate) font-semibold truncate">
          {slug}
        </span>
      </div>

      <StatusBadge
        active={isActive}
        label={t(isActive ? "admin.merchants.active" : "admin.merchants.inactive")}
      />

      {onEdit && (
        <button
          type="button"
          aria-label={t("admin.merchants.form.edit")}
          onClick={() => {
            haptic.light();
            onEdit();
          }}
          className="flex items-center justify-center size-9 rounded-full border border-(--color-line) bg-(--color-chip) text-(--color-hint) shrink-0 cursor-pointer"
        >
          <Pencil size={16} />
        </button>
      )}
    </div>
  );
};
