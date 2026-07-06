export const AdminMerchantCardSkeleton = () => (
  <div className="w-full bg-(--color-card) rounded-2xl p-3 border border-(--color-line) shadow-xs flex items-center gap-3.5">
    <span className="size-12 rounded-xl shrink-0 bg-(--color-chip) animate-pulse" />

    <span className="flex-1 min-w-0">
      <span className="block h-4 w-28 rounded-md bg-(--color-chip) animate-pulse" />
    </span>

    <span className="h-6 w-16 rounded-lg bg-(--color-chip) animate-pulse shrink-0" />
  </div>
);
