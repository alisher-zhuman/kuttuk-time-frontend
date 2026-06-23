import { useQuery } from "@tanstack/react-query";

import { getMerchants } from "../api";
import { merchantKeys } from "../model/keys";
import type { MerchantSchema } from "../model/schemas";

import type { z } from "zod";

export type Merchant = z.infer<typeof MerchantSchema>;

interface Params {
  search: string;
  category: string;
}

export const useMerchantsQuery = ({ search, category }: Params) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: merchantKeys.list(search, category),
    queryFn: () => getMerchants({ search, category }),
  });

  return { merchants: data ?? [], isLoading, isError };
};
