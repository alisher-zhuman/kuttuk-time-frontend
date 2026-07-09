import { useQuery } from "@tanstack/react-query";

import { getAdminMerchant } from "../api";
import { merchantKeys } from "../model/keys";

export const useAdminMerchantQuery = (id: string | undefined) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: merchantKeys.adminDetail(id ?? ""),
    queryFn: () => getAdminMerchant(id!),
    enabled: Boolean(id)
  });

  return { merchant: data, isLoading, isError };
};
