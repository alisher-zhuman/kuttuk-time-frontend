import { useQuery } from "@tanstack/react-query";

import { getAdminVenue } from "../api";
import { venueKeys } from "../model/keys";

export const useAdminVenueQuery = (id: string | undefined) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: venueKeys.adminDetail(id ?? ""),
    queryFn: () => getAdminVenue(id!),
    enabled: Boolean(id)
  });

  return { venue: data, isLoading, isError };
};
