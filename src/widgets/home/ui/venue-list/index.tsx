import { useTranslation } from "react-i18next";

import { Store } from "lucide-react";

import {
  useVenuesQuery,
  VenueCard,
  VenueCardSkeleton
} from "@entities/venue";

import { EmptyState, ErrorState } from "@shared/ui";

interface Props {
  category: number | null;
  search: string;
}

export const VenueList = ({ category, search }: Props) => {
  const { t } = useTranslation();

  const { venues, isLoading, isError, isFetching, retry } = useVenuesQuery({
    search,
    category
  });

  return (
    <section aria-label={t("home.venuesSection")}>
      <h2 className="text-xs font-bold text-(--color-hint) tracking-wider pt-5.5 pb-2.5 px-1">
        {t("home.venuesSection")}
      </h2>

      {isLoading ? (
        <ul className="pb-5 flex flex-col gap-2.5 list-none">
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={i}>
              <VenueCardSkeleton />
            </li>
          ))}
        </ul>
      ) : isError ? (
        <ErrorState onRetry={retry} isRetrying={isFetching} />
      ) : venues.length === 0 ? (
        <EmptyState
          icon={<Store size={32} strokeWidth={1.5} />}
          message={t("home.empty")}
        />
      ) : (
        <ul className="pb-5 flex flex-col gap-2.5 list-none">
          {venues.map((venue) => (
            <li key={venue.id}>
              <VenueCard venue={venue} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
