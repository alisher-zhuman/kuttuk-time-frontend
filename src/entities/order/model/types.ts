import type {
  AdminOrderDetailSchema,
  AdminOrderSchema,
  OrderSchema
} from "./schemas";

import type { z } from "zod";

export type Order = z.infer<typeof OrderSchema>;
export type OrderStatus = Order["status"];
export type PendingOrder = Extract<Order, { status: "pending" }>;
export type ExpiredOrder = Extract<Order, { status: "expired" }>;
export type AdminOrder = z.infer<typeof AdminOrderSchema>;
export type AdminOrderDetail = z.infer<typeof AdminOrderDetailSchema>;
