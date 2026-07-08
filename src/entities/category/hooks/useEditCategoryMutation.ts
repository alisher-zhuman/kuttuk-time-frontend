import { useMutation, useQueryClient } from "@tanstack/react-query";

import { editCategory } from "../api";

export const useEditCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editCategory,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
