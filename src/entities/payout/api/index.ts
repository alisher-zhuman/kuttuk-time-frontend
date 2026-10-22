import { isAxiosError } from "axios";

import { api } from "@shared/api";
import { API_PATHS } from "@shared/constants";

import {
  AmountChangedSchema,
  MarkedPayoutSchema,
  NothingToPayOutSchema,
  PayoutWeekSchema
} from "../model/schemas";

// week: any "YYYY-MM-DD" inside the week, null → the current week.
export const getPayoutWeek = async (week: string | null) => {
  const response = await api.get(API_PATHS.ADMIN_PAYOUTS, { params: week ? { week } : {} });

  return PayoutWeekSchema.parse(response.data);
};

export interface MarkPaidOutPayload {
  merchantId: number;
  // Any date inside the week — the report's `from`.
  week: string;
  // The amount the admin saw and transferred — the server records only if
  // its own amount still matches (else 409 amount_changed).
  expectedPayout: number;
  note?: string;
}

// After the money was transferred by hand. No amount is sent: the server pays
// out exactly what's still due. No undo.
export const markPaidOut = async (payload: MarkPaidOutPayload) => {
  const response = await api.post(API_PATHS.ADMIN_PAYOUTS, payload);

  return MarkedPayoutSchema.parse(response.data);
};

export const isNothingToPayOut = (error: unknown) =>
  isAxiosError(error) &&
  error.response?.status === 409 &&
  NothingToPayOutSchema.safeParse(error.response.data).success;

export const isAmountChanged = (error: unknown) =>
  isAxiosError(error) &&
  error.response?.status === 409 &&
  AmountChangedSchema.safeParse(error.response.data).success;
