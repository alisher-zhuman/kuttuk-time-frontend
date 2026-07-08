import { useTranslation } from "react-i18next";

import { useQuery } from "@tanstack/react-query";

import { getCategories } from "../api";
import { categoryKeys } from "../model/keys";

export const useCategoriesQuery = () => {
  const { i18n } = useTranslation();

  const { data, isLoading, isError } = useQuery({
    queryKey: categoryKeys.list(i18n.language),
    queryFn: getCategories
  });

  const categories = data ?? [];

  return { categories, isLoading, isError };
};
