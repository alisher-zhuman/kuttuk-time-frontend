import { useTranslation } from "react-i18next";

import { Plus } from "lucide-react";

import { AdminVenueCard, type ManagedVenue } from "@entities/venue";

import { useHaptic } from "@shared/hooks";

interface Props {
  venues: ManagedVenue[];
  onOpenVenue: (venueId: number) => void;
  onAddVenue: () => void;
}

export const MerchantDetailVenues = ({ venues, onOpenVenue, onAddVenue }: Props) => {
  const { t } = useTranslation();

  const haptic = useHaptic();

  return (
    <section className="flex flex-col gap-2.5">
      <h2 className="text-xs font-bold text-(--color-hint) tracking-wider px-1">
        {t("admin.merchants.detail.venues")}
      </h2>

      {venues.length === 0 ? (
        <p className="text-sm font-semibold text-(--color-hint) px-1">
          {t("admin.merchants.detail.noVenues")}
        </p>
      ) : (
        <ul className="flex flex-col gap-2.5 list-none">
          {venues.map((venue) => (
            <li key={venue.id}>
              <AdminVenueCard
                venue={venue}
                onClick={() => {
                  haptic.light();
                  onOpenVenue(venue.id);
                }}
              />
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={() => {
          haptic.light();
          onAddVenue();
        }}
        className="w-full rounded-2xl border border-dashed border-(--color-line) py-3 flex items-center justify-center gap-1.5 text-sm font-bold text-(--color-primary) cursor-pointer"
      >
        <Plus size={16} />
        {t("admin.merchants.addVenue")}
      </button>
    </section>
  );
};
