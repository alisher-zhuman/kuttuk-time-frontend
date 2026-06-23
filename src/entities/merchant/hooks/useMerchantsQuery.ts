import type { Merchant } from "../model/types";

export const useMerchantsQuery = () => {
  return { merchants: [] as Merchant[], isLoading: false, isError: false };
};
