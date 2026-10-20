import { api } from "@shared/api";
import { API_PATHS } from "@shared/constants";

import { CreatedOrderSchema, OrderSchema } from "../model/schemas";

export interface CreateOrderPayload {
  venueId: number;
  nominal: number;
}

export const createOrder = async (payload: CreateOrderPayload) => {
  const response = await api.post(API_PATHS.ORDERS, payload);

  return CreatedOrderSchema.parse(response.data);
};

export const getOrder = async (id: string, signal: AbortSignal) => {
  const response = await api.get(`${API_PATHS.ORDERS}/${id}`, { signal });

  return OrderSchema.parse(response.data);
};
