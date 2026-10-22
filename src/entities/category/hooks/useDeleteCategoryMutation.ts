import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteCategory } from "../api";

export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
      // Venues held the deleted id — refetch them so no form keeps it
      // (literal keys: entities don't import each other).
      void queryClient.invalidateQueries({ queryKey: ["venues"] });
      void queryClient.invalidateQueries({ queryKey: ["merchants"] });
    }
  });
};
