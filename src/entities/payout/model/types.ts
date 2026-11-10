import type { PayoutDueSchema, PayoutWeekSchema } from "./schemas";

import type { z } from "zod";

export type PayoutWeek = z.infer<typeof PayoutWeekSchema>;
export type PayoutDue = z.infer<typeof PayoutDueSchema>;
