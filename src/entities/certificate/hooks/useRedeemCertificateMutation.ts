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
      // The cabinet's list and weekly "redeemed" count changed. Literal key for
      // the summary: it belongs to the merchant entity (FSD — entities don't
      // import each other).
      void queryClient.invalidateQueries({ queryKey: ["certificates", "merchant-list"] });
      void queryClient.invalidateQueries({ queryKey: ["merchants", "me", "summary"] });
    }
  });
};
