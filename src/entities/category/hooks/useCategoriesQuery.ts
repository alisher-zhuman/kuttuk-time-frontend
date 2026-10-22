import { useTranslation } from "react-i18next";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getCategories } from "../api";
import { categoryKeys } from "../model/keys";

export const useCategoriesQuery = () => {
  const { i18n } = useTranslation();

  const { data, isLoading, isError } = useQuery({
    queryKey: categoryKeys.list(i18n.language),
    // A language switch keeps the chips until the translated ones land.
    placeholderData: keepPreviousData,
    queryFn: getCategories
  });

  const categories = data ?? [];

  return { categories, isLoading, isError };
};
