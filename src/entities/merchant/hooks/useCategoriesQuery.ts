import { useQuery } from "@tanstack/react-query";

import { getCategories } from "../api";
import { merchantKeys } from "../model/keys";

export const useCategoriesQuery = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: merchantKeys.categories(),
    queryFn: getCategories,
  });

  const categories = data ?? [];

  return { categories, isLoading, isError };
};
