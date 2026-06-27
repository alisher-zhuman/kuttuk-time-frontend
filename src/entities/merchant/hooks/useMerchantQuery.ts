import { useQuery } from "@tanstack/react-query";

import { getMerchant } from "../api";
import { merchantKeys } from "../model/keys";
import type { MerchantDetailSchema } from "../model/schemas";

import type { z } from "zod";

export type MerchantDetail = z.infer<typeof MerchantDetailSchema>;

export const useMerchantQuery = (id: number) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: merchantKeys.detail(id),
    queryFn: () => getMerchant(id),
    enabled: !isNaN(id),
  });

  return { merchant: data, isLoading, isError };
};
