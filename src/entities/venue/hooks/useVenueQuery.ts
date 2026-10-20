import { useTranslation } from "react-i18next";

import { useQuery } from "@tanstack/react-query";

import { getVenue } from "../api";
import { venueKeys } from "../model/keys";

export const useVenueQuery = (idOrSlug: string | undefined) => {
  const { i18n } = useTranslation();

  const { data, isLoading, isError } = useQuery({
    queryKey: venueKeys.detail(idOrSlug ?? "", i18n.language),
    queryFn: () => getVenue(idOrSlug!),
    enabled: Boolean(idOrSlug)
  });

  return { venue: data, isLoading, isError };
};
