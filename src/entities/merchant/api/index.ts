import { api } from "@shared/api";
import { API_PATHS } from "@shared/constants";

import { CategoriesSchema, MerchantsSchema } from "../model/schemas";

export const getMerchantsCategories = async (): Promise<string[]> => {
  const response = await api.get(API_PATHS.MERCHANTS_CATEGORIES);

  return CategoriesSchema.parse(response.data);
};

interface GetMerchantsParams {
  search?: string;
  category?: string;
}

export const getMerchants = async (params: GetMerchantsParams = {}) => {
  const response = await api.get(API_PATHS.MERCHANTS, {
    params: {
      ...(params.search && { search: params.search }),
      ...(params.category && params.category !== "all" && { category: params.category }),
    },
  });

  return MerchantsSchema.parse(response.data);
};
