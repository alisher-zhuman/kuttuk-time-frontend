import { useQuery } from "@tanstack/react-query";

import { getMerchantCertificate } from "../api";
import { certificateKeys } from "../model/keys";

// Looks up the merchant's own certificate by the submitted code (null = nothing
// submitted yet).
export const useMerchantCertificateQuery = (code: string | null) => {
  const { data, error, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: certificateKeys.merchantLookup(code ?? ""),
    queryFn: ({ signal }) => getMerchantCertificate(code!, signal),
    enabled: code !== null,
    // Status changes at the counter; always ask the backend again.
    staleTime: 0
  });

  return { certificate: data, error, isLoading, isError, isFetching, refetch };
};
