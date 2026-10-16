import { useQuery } from "@tanstack/react-query";

import { getAdminCategories } from "../api";
import { categoryKeys } from "../model/keys";

export const useAdminCategoriesQuery = () => {
  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: categoryKeys.adminList(),
    queryFn: getAdminCategories
  });

  return {
    categories: data ?? [],
    isLoading,
    isError,
    isFetching,
    retry: () => void refetch()
  };
};
