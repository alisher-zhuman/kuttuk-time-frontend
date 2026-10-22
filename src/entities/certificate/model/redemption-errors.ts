import { isAxiosError } from "axios";

import { RedeemConflictSchema } from "./schemas";

// Lookup / redeem errors → i18n keys. 409 is not here: it means the
// certificate changed (used / expired) and the caller re-fetches to show it.
export const getRedemptionErrorKey = (error: unknown): string => {
  if (!isAxiosError(error)) {
    return "errors.generic";
  }

  if (!error.response) {
    return "orders.errors.network";
  }

  switch (error.response.status) {
    case 400:
      return "merchant.redeem.invalidCode";
    // Another merchant's certificate is indistinguishable from a missing one.
    case 404:
      return "certificates.notFound";
    case 429:
      return "orders.errors.tooManyRequests";
    default:
      return "errors.generic";
  }
};

export const isRedeemConflict = (error: unknown) =>
  isAxiosError(error) &&
  error.response?.status === 409 &&
  RedeemConflictSchema.safeParse(error.response.data).success;
