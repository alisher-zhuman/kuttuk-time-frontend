import { api } from "@shared/api";
import { API_PATHS } from "@shared/constants";

import { CategoriesSchema } from "../model/schemas";

export const getMerchantsCategories = async (): Promise<string[]> => {
  const response = await api.get(API_PATHS.MERCHANTS_CATEGORIES);

  return CategoriesSchema.parse(response.data);
};
