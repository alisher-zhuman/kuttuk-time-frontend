import type { OrderStatus } from "./types";

export interface AdminOrderFilters {
  status: OrderStatus | null;
  search: string;
  venueId: number | null;
  merchantId: number | null;
  // The buyer - the «ID» in their profile.
  userId: number | null;
}

export const orderKeys = {
  detail: (id: string) => ["orders", "detail", id] as const,
  adminList: (filters: AdminOrderFilters) =>
    [
      "orders",
      "admin-list",
      filters.status,
      filters.search,
      filters.venueId,
      filters.merchantId,
      filters.userId
    ] as const,
  adminDetail: (id: string) => ["orders", "admin-detail", id] as const
};
