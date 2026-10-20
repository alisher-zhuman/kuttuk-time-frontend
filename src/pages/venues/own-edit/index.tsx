import { useParams } from "react-router";

import { useTranslation } from "react-i18next";

import { Loader2, Store } from "lucide-react";

import { VenueNotFound } from "@widgets/venues/venue-detail";
import { VenueForm } from "@widgets/venues/venue-form";

import { MerchantDeactivatedNotice, useMerchantMeQuery } from "@entities/merchant";
import { useVenueOptionsQuery } from "@entities/venue";

import { EmptyState, ErrorState } from "@shared/ui";

// The owner edits the storefront of one of its venues; the venue comes from
// GET /merchants/me, which already lists them all with full fields.
export const OwnVenueEditPage = () => {
  const { venueId } = useParams<{ venueId: string }>();

  const { t } = useTranslation();

  const { merchant, isLoading, isError } = useMerchantMeQuery();

  const optionsQuery = useVenueOptionsQuery();

  if (isLoading || optionsQuery.isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 size={28} color="var(--color-hint)" className="animate-spin" />
      </div>
    );
  }

  if (isError || !merchant) {
    return (
      <EmptyState
        variant="page"
        icon={<Store size={32} strokeWidth={1.5} />}
        message={t("merchant.home.loadError")}
      />
    );
  }

  // Also reached when a save gets 403 mid-edit: the mutation refetches "me",
  // and the fresh isActive: false swaps the form for this notice.
  if (!merchant.isActive) {
    return (
      <div className="mt-3.5">
        <MerchantDeactivatedNotice />
      </div>
    );
  }

  const venue = merchant.venues.find((item) => String(item.id) === venueId);

  if (!venue) return <VenueNotFound />;

  if (optionsQuery.isError || !optionsQuery.options) {
    return <ErrorState onRetry={optionsQuery.retry} isRetrying={optionsQuery.isFetching} />;
  }

  return <VenueForm options={optionsQuery.options} variant={{ kind: "own", venue }} />;
};
