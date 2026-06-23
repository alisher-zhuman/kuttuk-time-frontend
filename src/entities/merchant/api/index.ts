import { api } from "@shared/api";
import { API_PATHS } from "@shared/constants";

import { CategoriesSchema, MerchantsSchema } from "../model/schemas";

export const getMerchantsCategories = async (): Promise<string[]> => {
  const response = await api.get(API_PATHS.MERCHANTS_CATEGORIES);

  return CategoriesSchema.parse(response.data);
};

export const getMerchants = async () => {
  const response = await api.get(API_PATHS.MERCHANTS);

  return MerchantsSchema.parse(response.data);
};
