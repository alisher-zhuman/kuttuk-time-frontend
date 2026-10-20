import { useTranslation } from "react-i18next";

import { ChevronRight } from "lucide-react";

import { StatusBadge } from "@shared/ui";

import type { AdminVenue } from "../../model/types";

interface Props {
  // Picked fields so the merchant's page can render its ManagedVenue list too.
  venue: Pick<AdminVenue, "name" | "logo" | "isActive">;
  onClick: () => void;
}

export const AdminVenueCard = ({ venue, onClick }: Props) => {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full bg-(--color-card) rounded-2xl p-3 border border-(--color-line) shadow-xs flex items-center gap-3.5 text-left cursor-pointer"
    >
      <img
        src={venue.logo}
        alt={venue.name}
        className="size-12 rounded-xl shrink-0 object-cover"
      />

      <span className="flex-1 min-w-0 text-base font-extrabold tracking-tight text-(--color-ink) truncate">
        {venue.name}
      </span>

      <StatusBadge
        active={venue.isActive}
        label={t(venue.isActive ? "admin.venues.active" : "admin.venues.inactive")}
      />

      <ChevronRight size={17} color="var(--color-hint)" />
    </button>
  );
};
