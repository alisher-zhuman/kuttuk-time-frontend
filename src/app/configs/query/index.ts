import { ZodError } from "zod";

import { keepPreviousData, QueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";

// Retry once, and only what can succeed on a second try: network drops and 5xx.
// A 4xx (e.g. 404 merchant) or a response failing Zod validation fails the
// same way again and only delays the not-found / error screen.
const shouldRetry = (failureCount: number, error: unknown) => {
  if (failureCount >= 1) {
    return false;
  }

  if (error instanceof ZodError) {
    return false;
  }

  return !(isAxiosError(error) && error.response && error.response.status < 500);
};

export const QUERY_CLIENT = new QueryClient({
  defaultOptions: {
    queries: {
      placeholderData: keepPreviousData,
      staleTime: 60_000,
      retry: shouldRetry,
      refetchOnWindowFocus: false
    }
  }
});
