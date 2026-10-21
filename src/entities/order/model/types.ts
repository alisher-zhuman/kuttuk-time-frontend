import type {
  AdminOrderDetailSchema,
  AdminOrderSchema,
  CreatedOrderSchema,
  OrderCertificateSchema,
  OrderSchema
} from "./schemas";

import type { z } from "zod";

export type CreatedOrder = z.infer<typeof CreatedOrderSchema>;
export type OrderCertificate = z.infer<typeof OrderCertificateSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type OrderStatus = Order["status"];
export type PendingOrder = Extract<Order, { status: "pending" }>;
export type ExpiredOrder = Extract<Order, { status: "expired" }>;
export type AdminOrder = z.infer<typeof AdminOrderSchema>;
export type AdminOrderDetail = z.infer<typeof AdminOrderDetailSchema>;
