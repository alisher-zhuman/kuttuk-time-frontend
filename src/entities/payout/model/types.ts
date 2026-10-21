import type { MarkedPayoutSchema, PayoutWeekSchema } from "./schemas";

import type { z } from "zod";

export type PayoutWeek = z.infer<typeof PayoutWeekSchema>;
export type MarkedPayout = z.infer<typeof MarkedPayoutSchema>;
