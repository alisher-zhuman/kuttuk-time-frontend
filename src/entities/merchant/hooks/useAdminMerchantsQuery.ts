import { useTranslation } from "react-i18next";

import { useQuery } from "@tanstack/react-query";

import { getAdminMerchants } from "../api";
import { merchantKeys } from "../model/keys";
import type { AdminMerchantSchema } from "../model/schemas";

import type { z } from "zod";

export type AdminMerchant = z.infer<typeof AdminMerchantSchema>;

export const useAdminMerchantsQuery = () => {
  const { i18n } = useTranslation();

  const { data, isLoading, isError } = useQuery({
    queryKey: merchantKeys.adminList(i18n.language),
    queryFn: getAdminMerchants,
  });

  return { merchants: data ?? [], isLoading, isError };
};
