import { useTranslation } from "react-i18next";

import { useQuery } from "@tanstack/react-query";

import { getMerchant } from "../api";
import { merchantKeys } from "../model/keys";
import type { MerchantDetailSchema } from "../model/schemas";

import type { z } from "zod";

export type MerchantDetail = z.infer<typeof MerchantDetailSchema>;

export const useMerchantQuery = (id: string | undefined) => {
  const { i18n } = useTranslation();

  const { data, isLoading, isError } = useQuery({
    queryKey: merchantKeys.detail(id ?? "", i18n.language),
    queryFn: () => getMerchant(id!),
    enabled: Boolean(id),
  });

  return { merchant: data, isLoading, isError };
};
