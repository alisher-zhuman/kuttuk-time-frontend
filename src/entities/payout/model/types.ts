import type { PayoutWeekSchema } from "./schemas";

import type { z } from "zod";

export type PayoutWeek = z.infer<typeof PayoutWeekSchema>;
