import { api } from "@shared/api";
import { API_PATHS } from "@shared/constants";

import {
  AdminOrderDetailSchema,
  AdminOrderPageSchema,
  CreatedOrderSchema,
  OrderSchema
} from "../model/schemas";
import type { OrderStatus } from "../model/types";

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

// search: a certificate code (any case / spacing) or an order id — anything
// else is a 400 (see isAdminOrderSearchError).
export const getAdminOrders = async (
  params: { status: OrderStatus | null; search: string; cursor: string | null },
  signal: AbortSignal
) => {
  const response = await api.get(API_PATHS.ADMIN_ORDERS, {
    params: {
      ...(params.status && { status: params.status }),
      ...(params.search && { search: params.search }),
      ...(params.cursor && { cursor: params.cursor })
    },
    signal
  });

  return AdminOrderPageSchema.parse(response.data);
};

export const getAdminOrder = async (id: string) => {
  const response = await api.get(`${API_PATHS.ADMIN_ORDERS}/${id}`);

  return AdminOrderDetailSchema.parse(response.data);
};
