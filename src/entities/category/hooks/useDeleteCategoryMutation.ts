import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteCategory } from "../api";

export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
    }
  });
};
