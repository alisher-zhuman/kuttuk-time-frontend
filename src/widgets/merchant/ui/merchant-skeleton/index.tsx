export const MerchantSkeleton = () => (
  <div className="flex-1 flex flex-col py-4 gap-5">
    <div className="flex items-center gap-3.5">
      <span className="size-16 rounded-xl shrink-0 bg-(--color-chip) animate-pulse" />

      <div className="flex flex-col gap-2">
        <span className="h-5 w-32 rounded-lg bg-(--color-chip) animate-pulse" />
        <span className="h-3.5 w-48 rounded-lg bg-(--color-chip) animate-pulse" />
      </div>
    </div>

    <span className="h-36 w-full rounded-2xl bg-(--color-chip) animate-pulse" />

    <div className="flex flex-col gap-2.5">
      <span className="h-3 w-20 rounded-md bg-(--color-chip) animate-pulse" />
      <span className="h-52 w-full rounded-2xl bg-(--color-chip) animate-pulse" />
    </div>
  </div>
);
