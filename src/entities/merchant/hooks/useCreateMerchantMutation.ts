import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createMerchant } from "../api";

export const useCreateMerchantMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMerchant,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["merchants"] });
    }
  });
};
