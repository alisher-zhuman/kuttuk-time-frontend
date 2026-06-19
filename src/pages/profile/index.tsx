export const ProfilePage = () => {
  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 rounded-full bg-(--color-card)" />
        <div className="flex flex-col gap-2">
          <div className="w-32 h-4 rounded-md bg-(--color-card)" />
          <div className="w-20 h-3 rounded-md bg-(--color-line)" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="w-24 h-3 rounded-md bg-(--color-line)" />
        <div className="w-full h-14 rounded-xl bg-(--color-card)" />
      </div>

      <div className="flex flex-col gap-2">
        <div className="w-24 h-3 rounded-md bg-(--color-line)" />
        <div className="flex flex-col gap-px rounded-xl overflow-hidden">
          <div className="w-full h-12 bg-(--color-card)" />
          <div className="w-full h-12 bg-(--color-card)" />
          <div className="w-full h-12 bg-(--color-card)" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="w-24 h-3 rounded-md bg-(--color-line)" />
        <div className="flex flex-col gap-px rounded-xl overflow-hidden">
          <div className="w-full h-12 bg-(--color-card)" />
          <div className="w-full h-12 bg-(--color-card)" />
        </div>
      </div>
    </div>
  );
};
