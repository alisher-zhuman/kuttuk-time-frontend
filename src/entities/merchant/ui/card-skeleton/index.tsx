export const MerchantCardSkeleton = () => (
  <div className="w-full bg-(--color-card) rounded-2xl p-3 border border-(--color-line) shadow-xs flex items-center gap-3.5">
    <span className="size-12 rounded-xl shrink-0 bg-(--color-chip) animate-pulse" />
    <span className="flex-1 min-w-0 flex flex-col gap-1.5">
      <span className="h-4 w-28 rounded-md bg-(--color-chip) animate-pulse" />
      <span className="h-3 w-40 rounded-md bg-(--color-chip) animate-pulse" />
    </span>
    <span className="flex flex-col items-end gap-1.5 shrink-0">
      <span className="h-3 w-10 rounded-md bg-(--color-chip) animate-pulse" />
      <span className="h-4 w-16 rounded-md bg-(--color-chip) animate-pulse" />
    </span>
  </div>
);
