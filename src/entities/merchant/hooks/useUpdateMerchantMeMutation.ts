import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";

import { updateMerchantMe, type UpdateMerchantMePayload } from "../api";
import { merchantKeys } from "../model/keys";

export const useUpdateMerchantMeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateMerchantMePayload) => updateMerchantMe(payload),
    onSuccess: () => {
      // Storefront edits also affect the buyer-facing list/detail, so refresh
      // the whole merchants tree, not just the "me" profile.
      void queryClient.invalidateQueries({ queryKey: ["merchants"] });
    },
    onError: (error) => {
      // 403 = the admin deactivated this merchant while the form was open.
      // Refetch "me" so pages pick up isActive: false and show the notice.
      if (isAxiosError(error) && error.response?.status === 403) {
        void queryClient.invalidateQueries({ queryKey: merchantKeys.me() });
      }
    }
  });
};
