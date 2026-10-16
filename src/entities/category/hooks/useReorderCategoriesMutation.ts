import { useMutation, useQueryClient } from "@tanstack/react-query";

import { reorderCategories } from "../api";
import { categoryKeys } from "../model/keys";
import type { AdminCategory } from "../model/types";

export const useReorderCategoriesMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reorderCategories,
    onMutate: async (ids) => {
      await queryClient.cancelQueries({ queryKey: categoryKeys.adminList() });

      const previous = queryClient.getQueryData<AdminCategory[]>(categoryKeys.adminList());

      if (previous) {
        const byId = new Map(previous.map((category) => [category.id, category]));

        queryClient.setQueryData<AdminCategory[]>(
          categoryKeys.adminList(),
          ids
            .map((id, index) => {
              const category = byId.get(id);
              return category ? { ...category, order: index } : undefined;
            })
            .filter((category): category is AdminCategory => category !== undefined)
        );
      }

      return { previous };
    },
    onError: (_error, _ids, context) => {
      if (context?.previous) {
        queryClient.setQueryData(categoryKeys.adminList(), context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
    }
  });
};
