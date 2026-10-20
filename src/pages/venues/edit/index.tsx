import { useParams } from "react-router";

import { Loader2 } from "lucide-react";

import { VenueNotFound } from "@widgets/venues/venue-detail";
import { VenueForm } from "@widgets/venues/venue-form";

import { useAdminVenueQuery, useVenueOptionsQuery } from "@entities/venue";

import { ErrorState } from "@shared/ui";

export const VenueEditPage = () => {
  const { id } = useParams<{ id: string }>();

  const { venue, isLoading, isError } = useAdminVenueQuery(id);

  const optionsQuery = useVenueOptionsQuery();

  if (isLoading || optionsQuery.isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 size={28} color="var(--color-hint)" className="animate-spin" />
      </div>
    );
  }

  if (isError || !venue) return <VenueNotFound />;

  if (optionsQuery.isError || !optionsQuery.options) {
    return <ErrorState onRetry={optionsQuery.retry} isRetrying={optionsQuery.isFetching} />;
  }

  return <VenueForm options={optionsQuery.options} variant={{ kind: "edit", venue }} />;
};
