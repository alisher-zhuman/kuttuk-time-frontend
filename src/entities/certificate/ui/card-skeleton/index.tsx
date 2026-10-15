export const CertificateCardSkeleton = () => (
  <div className="flex flex-col gap-3 p-3 bg-(--color-card) rounded-2xl border border-(--color-line)">
    <div className="flex items-center gap-3">
      <span className="size-12 rounded-xl shrink-0 bg-(--color-chip) animate-pulse" />

      <span className="flex-1 flex flex-col gap-1.5">
        <span className="h-4 w-28 rounded-md bg-(--color-chip) animate-pulse" />
        <span className="h-4 w-20 rounded-md bg-(--color-chip) animate-pulse" />
      </span>
    </div>

    <span className="h-7 w-36 rounded-xl bg-(--color-chip) animate-pulse" />
  </div>
);
