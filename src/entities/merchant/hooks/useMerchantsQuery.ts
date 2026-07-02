import { useTranslation } from "react-i18next";

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
  const { i18n } = useTranslation();

  const { data, isLoading, isError } = useQuery({
    queryKey: merchantKeys.list(search, category, i18n.language),
    queryFn: () => getMerchants({ search, category }),
  });

  return { merchants: data ?? [], isLoading, isError };
};
