import { useCallback } from "react";
import { useSearchParams } from "react-router";

// One URL search param as state — for filters and tabs that must survive Back
// and be linkable (?status=needs_review, ?tab=settings). Setting null or ""
// drops the param; history entries are replaced, not stacked.
export const useSearchParamState = (key: string) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const setValue = useCallback(
    (value: string | null) => {
      setSearchParams(
        (prev) => {
          if (value) {
            prev.set(key, value);
          } else {
            prev.delete(key);
          }

          return prev;
        },
        { replace: true }
      );
    },
    [key, setSearchParams]
  );

  return [searchParams.get(key), setValue] as const;
};
