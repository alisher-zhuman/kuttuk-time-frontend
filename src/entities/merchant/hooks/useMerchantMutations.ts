import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createMerchant, updateMerchant, type UpdateMerchantPayload } from "../api";

// Deactivating a merchant hides all its venues from buyers, so the venue
// views refresh too (literal key — entities don't import each other).
const invalidateMerchantViews = (queryClient: ReturnType<typeof useQueryClient>) => {
  void queryClient.invalidateQueries({ queryKey: ["merchants"] });
  void queryClient.invalidateQueries({ queryKey: ["venues"] });
};

export const useCreateMerchantMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMerchant,
    onSuccess: () => invalidateMerchantViews(queryClient)
  });
};

export const useUpdateMerchantMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateMerchantPayload }) =>
      updateMerchant(id, payload),
    onSuccess: () => invalidateMerchantViews(queryClient)
  });
};
