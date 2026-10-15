import type {
  CertificateSchema,
  CreatedOrderSchema,
  OrderSchema,
  OrderStatusSchema
} from "./schemas";

import type { z } from "zod";

export type OrderStatus = z.infer<typeof OrderStatusSchema>;
export type CreatedOrder = z.infer<typeof CreatedOrderSchema>;
export type Certificate = z.infer<typeof CertificateSchema>;
export type Order = z.infer<typeof OrderSchema>;
