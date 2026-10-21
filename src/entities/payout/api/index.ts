import { api } from "@shared/api";
import { API_PATHS } from "@shared/constants";

import { PayoutWeekSchema } from "../model/schemas";

// week: any "YYYY-MM-DD" inside the week, null → the current week.
export const getPayoutWeek = async (week: string | null) => {
  const response = await api.get(API_PATHS.ADMIN_PAYOUTS, { params: week ? { week } : {} });

  return PayoutWeekSchema.parse(response.data);
};
