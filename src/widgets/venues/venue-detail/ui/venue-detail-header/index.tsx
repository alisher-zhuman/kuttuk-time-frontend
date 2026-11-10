import { useTranslation } from "react-i18next";

import { Pencil } from "lucide-react";

import { logoUrl } from "@shared/helpers";
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

export const VenueDetailHeader = ({ logo, name, slug, isActive, onEdit }: Props) => {
  const { t } = useTranslation();

  const haptic = useHaptic();

  return (
    <div className="flex items-center gap-3.5">
      <img
        src={logoUrl(logo, 64)}
        width={64}
        height={64}
        alt={name}
        className="size-16 rounded-xl shrink-0 object-cover"
      />

      {/* Name, slug and status in one column: a badge beside them left a
          long name three letters at 320 px. */}
      <div className="flex-1 flex flex-col items-start min-w-0 gap-1">
        <span className="max-w-full text-xl font-extrabold tracking-tight text-(--color-ink) leading-tight line-clamp-3 wrap-break-word">
          {name}
        </span>
        <span className="max-w-full text-sm text-(--color-slate) font-semibold truncate">
          {slug}
        </span>
        <StatusBadge
          active={isActive}
          label={t(isActive ? "admin.venues.active" : "admin.venues.inactive")}
        />
      </div>

      {onEdit && (
        <button
          type="button"
          aria-label={t("venueForm.edit")}
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
