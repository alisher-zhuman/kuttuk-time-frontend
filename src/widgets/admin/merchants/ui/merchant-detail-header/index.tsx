import { useTranslation } from "react-i18next";

import { Pencil } from "lucide-react";

import { cn } from "@shared/helpers";
import { useHaptic } from "@shared/hooks";

interface Props {
  logo: string;
  name: string;
  slug: string;
  isActive: boolean;
  onEdit: () => void;
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

      <span
        className={cn(
          "flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg whitespace-nowrap shrink-0",
          isActive
            ? "bg-(--color-green-tint) text-(--color-green)"
            : "bg-(--color-surface) text-(--color-hint)"
        )}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
        {t(isActive ? "admin.merchants.active" : "admin.merchants.inactive")}
      </span>

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
    </div>
  );
};
