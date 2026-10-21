import { useQuery } from "@tanstack/react-query";

import { getAdminOrder } from "../api";
import { orderKeys } from "../model/keys";

export const useAdminOrderQuery = (id: string | undefined) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: orderKeys.adminDetail(id ?? ""),
    queryFn: () => getAdminOrder(id!),
    enabled: Boolean(id)
  });

  return { order: data, isLoading, isError };
};
