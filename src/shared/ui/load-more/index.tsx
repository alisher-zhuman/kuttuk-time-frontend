import { useTranslation } from "react-i18next";

import { Loader2 } from "lucide-react";

interface Props {
  // From useLoadMoreOnScroll — the next page loads when this comes into view.
  sentinelRef: (element: HTMLElement | null) => void;
  isLoading: boolean;
  // The next page failed: the rows above stay, this retries just that page.
  isError: boolean;
  onRetry: () => void;
}

// The last item of an infinite list.
export const LoadMore = ({ sentinelRef, isLoading, isError, onRetry }: Props) => {
  const { t } = useTranslation();

  return (
    <li ref={sentinelRef} className="flex justify-center py-2">
      {isLoading && <Loader2 size={20} color="var(--color-hint)" className="animate-spin" />}

      {isError && !isLoading && (
        <button
          type="button"
          onClick={onRetry}
          className="px-4 py-2 rounded-full bg-(--color-chip) text-sm font-semibold text-(--color-ink) cursor-pointer"
        >
          {t("errors.retry")}
        </button>
      )}
    </li>
  );
};
