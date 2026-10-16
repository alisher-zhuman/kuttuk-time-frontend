export const AdminMerchantDetailSkeleton = () => (
  <div className="flex-1 flex flex-col py-4 gap-5">
    <div className="flex items-center gap-3.5">
      <span className="size-16 rounded-xl shrink-0 bg-(--color-chip) animate-pulse" />

      <div className="flex flex-col gap-2">
        <span className="h-5 w-32 rounded-lg bg-(--color-chip) animate-pulse" />
        <span className="h-3.5 w-24 rounded-lg bg-(--color-chip) animate-pulse" />
      </div>
    </div>

    <div className="flex flex-col gap-2">
      <span className="h-14 w-full rounded-xl bg-(--color-chip) animate-pulse" />
      <span className="h-14 w-full rounded-xl bg-(--color-chip) animate-pulse" />
    </div>

    <div className="flex flex-wrap gap-2">
      <span className="h-9 w-20 rounded-full bg-(--color-chip) animate-pulse" />
      <span className="h-9 w-24 rounded-full bg-(--color-chip) animate-pulse" />
      <span className="h-9 w-20 rounded-full bg-(--color-chip) animate-pulse" />
    </div>
  </div>
);
