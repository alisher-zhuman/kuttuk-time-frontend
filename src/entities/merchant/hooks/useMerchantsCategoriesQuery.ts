import { useTranslation } from "react-i18next";

import { useQuery } from "@tanstack/react-query";

import { getMerchantsCategories } from "../api";
import { merchantKeys } from "../model/keys";
import type { CategorySchema } from "../model/schemas";

import type { z } from "zod";

export type Category = z.infer<typeof CategorySchema>;

export const useMerchantsCategoriesQuery = () => {
  const { i18n } = useTranslation();

  const { data, isLoading, isError } = useQuery({
    queryKey: merchantKeys.categories(i18n.language),
    queryFn: getMerchantsCategories,
  });

  const categories = data ?? [];

  return { categories, isLoading, isError };
};
