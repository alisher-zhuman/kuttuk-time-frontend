import type { OrderStatus } from "./types";

export const orderKeys = {
  detail: (id: string) => ["orders", "detail", id] as const,
  adminList: (status: OrderStatus | null, search: string) =>
    ["orders", "admin-list", status, search] as const,
  adminDetail: (id: string) => ["orders", "admin-detail", id] as const
};
