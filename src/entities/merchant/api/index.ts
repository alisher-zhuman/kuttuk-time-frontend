import { api } from "@shared/api";
import { API_PATHS } from "@shared/constants";

import {
  AdminMerchantsSchema,
  MerchantDetailSchema,
  MerchantsSchema,
} from "../model/schemas";

interface GetAdminMerchantsParams {
  search?: string;
  category?: number | null;
  isActive?: boolean | null;
}

export const getAdminMerchants = async (params: GetAdminMerchantsParams = {}) => {
  const response = await api.get(API_PATHS.ADMIN_MERCHANTS, {
    params: {
      ...(params.search && { search: params.search }),
      ...(params.category != null && { category: params.category }),
      ...(params.isActive != null && { isActive: params.isActive }),
    },
  });

  return AdminMerchantsSchema.parse(response.data);
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
