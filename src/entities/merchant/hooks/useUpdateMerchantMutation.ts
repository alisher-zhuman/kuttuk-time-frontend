import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateMerchant, type UpdateMerchantPayload } from "../api";

interface UpdateMerchantVariables {
  id: number;
  payload: UpdateMerchantPayload;
}

export const useUpdateMerchantMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateMerchantVariables) => updateMerchant(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["merchants"] });
    }
  });
};
