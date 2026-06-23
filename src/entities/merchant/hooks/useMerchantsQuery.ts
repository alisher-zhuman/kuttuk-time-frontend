export interface Merchant {
  id: string;
  name: string;
  category: string;
  monogram: string;
  minAmount: number;
}

export const useMerchantsQuery = () => {
  return { merchants: [] as Merchant[], isLoading: false, isError: false };
};
