import { useMutation, useQueryClient } from "@tanstack/react-query";

import { markPaidOut } from "../api";

export const useMarkPaidOutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markPaidOut,
    // A 409 means someone already marked it — refresh in both cases. Orders get
    // a payoutId (literal key: entities don't import each other).
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["payouts"] });
      void queryClient.invalidateQueries({ queryKey: ["orders"] });
    }
  });
};
