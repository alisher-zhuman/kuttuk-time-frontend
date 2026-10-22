import { useTranslation } from "react-i18next";

import { type Category } from "@entities/category";
import { type ManagedVenue } from "@entities/venue";

import { formatMoney } from "@shared/helpers";

import { VenueDetailChips } from "../venue-detail-chips";
import { VenueDetailDescription } from "../venue-detail-description";
import { VenueDetailHeader } from "../venue-detail-header";
import { VenueDetailMeta } from "../venue-detail-meta";
import { VenueShareLink } from "../venue-share-link";

interface Props {
  venue: ManagedVenue;
  categories: Category[];
  onEdit?: (() => void) | undefined;
  // Admin only: who owns the venue, with a link to the merchant's page.
  owner?: { name: string; onOpen: () => void } | undefined;
}

// The full venue as the admin and the owner see it (the buyer sees the
// storefront in widgets/venue instead).
export const VenueDetail = ({ venue, categories, onEdit, owner }: Props) => {
  const { t } = useTranslation();

  const venueCategories = categories.filter((category) => venue.categories.includes(category.id));

  const currency = t("certificate.currency");

  return (
    <div className="flex flex-col py-4 gap-5">
      <VenueDetailHeader
        logo={venue.logo}
        name={venue.name}
        slug={venue.slug}
        isActive={venue.isActive}
        onEdit={onEdit}
      />

      <VenueDetailDescription description={venue.description} />

      <VenueShareLink slug={venue.slug} venueName={venue.name} />

      {venueCategories.length > 0 && (
        <VenueDetailChips
          label={t("admin.venues.detail.categories")}
          items={venueCategories.map((category) => ({ key: category.id, label: category.name }))}
        />
      )}

      <VenueDetailChips
        label={t("admin.venues.detail.nominals")}
        items={venue.nominals.map((nominal) => ({
          key: nominal,
          label: formatMoney(nominal, currency)
        }))}
      />

      <VenueDetailMeta validityMonths={venue.validityMonths} createdAt={venue.createdAt} owner={owner} />
    </div>
  );
};
