import { api } from "@shared/api";
import { API_PATHS } from "@shared/constants";

import { CategoriesSchema, MerchantDetailSchema, MerchantsSchema } from "../model/schemas";

export const getMerchantsCategories = async (): Promise<string[]> => {
  const response = await api.get(API_PATHS.CATEGORIES);

  const categories = CategoriesSchema.parse(response.data);

  return categories.map((c) => c.name);
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

export const getMerchant = async (id: number) => {
  const response = await api.get(`${API_PATHS.MERCHANTS}/${id}`);

  return MerchantDetailSchema.parse(response.data);
};
