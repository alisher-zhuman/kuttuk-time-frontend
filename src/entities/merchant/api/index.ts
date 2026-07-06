import { api } from "@shared/api";
import { API_PATHS } from "@shared/constants";

import {
  AdminMerchantsSchema,
  CategoriesSchema,
  MerchantDetailSchema,
  MerchantsSchema,
} from "../model/schemas";

export const getAdminMerchants = async () => {
  const response = await api.get(API_PATHS.ADMIN_MERCHANTS);

  return AdminMerchantsSchema.parse(response.data);
};

export const getMerchantsCategories = async () => {
  const response = await api.get(API_PATHS.CATEGORIES);

  return CategoriesSchema.parse(response.data);
};

interface GetMerchantsParams {
  search?: string;
  category?: number | null;
}

export const getMerchants = async (params: GetMerchantsParams = {}) => {
  const response = await api.get(API_PATHS.MERCHANTS, {
    params: {
      ...(params.search && { search: params.search }),
      ...(params.category != null && { category: params.category }),
    },
  });

  return MerchantsSchema.parse(response.data);
};

export const getMerchant = async (id: string | number) => {
  const response = await api.get(`${API_PATHS.MERCHANTS}/${id}`);

  return MerchantDetailSchema.parse(response.data);
};
