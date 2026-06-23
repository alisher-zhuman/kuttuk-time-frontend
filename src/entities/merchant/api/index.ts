import { api } from "@shared/api";
import { API_PATHS } from "@shared/constants";

import { CategoriesSchema } from "../model/schemas";

export const getCategories = async (): Promise<string[]> => {
  const response = await api.get(API_PATHS.MERCHANT_CATEGORIES);

  return CategoriesSchema.parse(response.data);
};
