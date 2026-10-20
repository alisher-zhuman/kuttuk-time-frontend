import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";

import {
  createVenue,
  updateOwnVenue,
  updateVenue,
  type UpdateVenuePayload,
  type VenueStorefrontPayload
} from "../api";

// Any venue edit changes the buyer catalog / storefront and the merchant views
// that embed venues (GET /merchants/me, admin merchant detail) — the latter by
// literal key: entities don't import each other.
const invalidateVenueViews = (queryClient: ReturnType<typeof useQueryClient>) => {
  void queryClient.invalidateQueries({ queryKey: ["venues"] });
  void queryClient.invalidateQueries({ queryKey: ["merchants"] });
};

export const useCreateVenueMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createVenue,
    onSuccess: () => invalidateVenueViews(queryClient)
  });
};

export const useUpdateVenueMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateVenuePayload }) =>
      updateVenue(id, payload),
    onSuccess: () => invalidateVenueViews(queryClient)
  });
};

export const useUpdateOwnVenueMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ venueId, payload }: { venueId: number; payload: VenueStorefrontPayload }) =>
      updateOwnVenue(venueId, payload),
    onSuccess: () => invalidateVenueViews(queryClient),
    onError: (error) => {
      // 403 = the admin deactivated the merchant while the form was open.
      // Refetch "me" so the page picks up isActive: false and shows the notice.
      if (isAxiosError(error) && error.response?.status === 403) {
        void queryClient.invalidateQueries({ queryKey: ["merchants", "me"] });
      }
    }
  });
};
