// Mirrors CertificateDetail so a cold open (direct link / reload, empty cache)
// shows the layout while the list loads — never "not found" before data.
export const CertificateDetailSkeleton = () => (
  <div className="flex-1 flex flex-col items-center justify-center gap-5 py-8">
    <span className="size-16 rounded-2xl bg-(--color-chip) animate-pulse" />

    <div className="flex flex-col items-center gap-2">
      <span className="h-4 w-28 rounded-md bg-(--color-chip) animate-pulse" />
      <span className="h-8 w-36 rounded-md bg-(--color-chip) animate-pulse" />
    </div>

    <div className="flex flex-col items-center gap-2">
      <span className="h-3 w-24 rounded-md bg-(--color-chip) animate-pulse" />
      <span className="h-12 w-52 rounded-2xl bg-(--color-chip) animate-pulse" />
      <span className="h-3 w-32 rounded-md bg-(--color-chip) animate-pulse" />
    </div>
  </div>
);
