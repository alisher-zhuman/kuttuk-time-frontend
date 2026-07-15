import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateMerchantMe, type UpdateMerchantMePayload } from "../api";

export const useUpdateMerchantMeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateMerchantMePayload) => updateMerchantMe(payload),
    onSuccess: () => {
      // Storefront edits also affect the buyer-facing list/detail, so refresh
      // the whole merchants tree, not just the "me" profile.
      void queryClient.invalidateQueries({ queryKey: ["merchants"] });
    }
  });
};
