import { useMutation } from "@tanstack/react-query";

import { createOrder } from "../api";

export const useCreateOrderMutation = () =>
  useMutation({
    mutationFn: createOrder
  });
