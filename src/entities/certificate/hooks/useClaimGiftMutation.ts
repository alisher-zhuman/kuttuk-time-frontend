import { useMutation, useQueryClient } from "@tanstack/react-query";

import { claimGift } from "../api";
import { isGiftConflict, isGiftNotFound } from "../model/gift-errors";
import { certificateKeys } from "../model/keys";
import type { Certificate } from "../model/types";

export const useClaimGiftMutation = (token: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => claimGift(token),
    onSuccess: (certificate) => {
      // The certificate screen reads the "my" list: put the claimed one in
      // now, so it opens without a "not found" flash; the refetch sorts it.
      queryClient.setQueryData<Certificate[]>(certificateKeys.my(), (list = []) => [
        certificate,
        ...list.filter(({ id }) => id !== certificate.id)
      ]);
      void queryClient.invalidateQueries({ queryKey: certificateKeys.my() });
      void queryClient.invalidateQueries({ queryKey: certificateKeys.gift(token) });
    },
    onError: (error) => {
      // Claimed / used / expired / own since it was shown (409), or replaced by
      // a newer card (404): look the link up again - the screen shows why.
      if (isGiftConflict(error) || isGiftNotFound(error)) {
        void queryClient.invalidateQueries({ queryKey: certificateKeys.gift(token) });
      }
    }
  });
};
