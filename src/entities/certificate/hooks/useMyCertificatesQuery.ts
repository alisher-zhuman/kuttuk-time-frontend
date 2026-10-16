import { useQuery } from "@tanstack/react-query";

import { getMyCertificates } from "../api";
import { certificateKeys } from "../model/keys";

export const useMyCertificatesQuery = () => {
  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: certificateKeys.my(),
    queryFn: getMyCertificates
  });

  return {
    certificates: data ?? [],
    isLoading,
    isError,
    isFetching,
    retry: () => void refetch()
  };
};
