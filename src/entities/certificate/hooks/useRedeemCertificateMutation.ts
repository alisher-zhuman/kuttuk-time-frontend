import { useMutation, useQueryClient } from "@tanstack/react-query";

import { redeemMerchantCertificate } from "../api";
import { certificateKeys } from "../model/keys";

export const useRedeemCertificateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ code }: { code: string }) => redeemMerchantCertificate(code),
    onSuccess: (certificate, { code }) => {
      // The lookup for this code now shows "used" without another request.
      queryClient.setQueryData(certificateKeys.merchantLookup(code), certificate);
    }
  });
};
