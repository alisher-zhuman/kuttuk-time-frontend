import { useTranslation } from "react-i18next";

import { useQuery } from "@tanstack/react-query";

import { getAdminMerchants } from "../api";
import { merchantKeys } from "../model/keys";

interface Params {
  search: string;
  category: number | null;
  isActive: boolean | null;
}

export const useAdminMerchantsQuery = ({ search, category, isActive }: Params) => {
  const { i18n } = useTranslation();

  const { data, isLoading, isError } = useQuery({
    queryKey: merchantKeys.adminList(search, category, isActive, i18n.language),
    queryFn: () => getAdminMerchants({ search, category, isActive })
  });

  return { merchants: data ?? [], isLoading, isError };
};
