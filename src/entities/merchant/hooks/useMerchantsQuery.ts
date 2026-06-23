import { useQuery } from "@tanstack/react-query";

import { getMerchants } from "../api";
import { merchantKeys } from "../model/keys";
import type { MerchantSchema } from "../model/schemas";

import type { z } from "zod";

export type Merchant = z.infer<typeof MerchantSchema>;

export const useMerchantsQuery = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: merchantKeys.all(),
    queryFn: getMerchants,
  });

  return { merchants: data ?? [], isLoading, isError };
};
