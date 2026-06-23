import { useQuery } from "@tanstack/react-query";

import { getMerchantsCategories } from "../api";
import { merchantKeys } from "../model/keys";

export const useMerchantsCategoriesQuery = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: merchantKeys.categories(),
    queryFn: getMerchantsCategories,
  });

  const categories = data ?? [];

  return { categories, isLoading, isError };
};
