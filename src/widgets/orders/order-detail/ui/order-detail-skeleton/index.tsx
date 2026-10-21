export const OrderDetailSkeleton = () => (
  <div className="flex-1 flex flex-col py-4 gap-5">
    <span className="h-8 w-40 rounded-lg bg-(--color-chip) animate-pulse" />

    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <span key={i} className="h-10 rounded-lg bg-(--color-chip) animate-pulse" />
      ))}
    </div>

    <span className="h-24 rounded-2xl bg-(--color-chip) animate-pulse" />
  </div>
);
