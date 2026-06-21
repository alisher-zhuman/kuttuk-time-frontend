import { User } from "lucide-react";

import type { TmaUserInfo } from "@shared/types";

interface Props {
  user: TmaUserInfo | null;
}

export const ProfileInfo = ({ user }: Props) => (
  <div className="flex items-center gap-4">
    {user?.photoUrl ? (
      <img
        src={user.photoUrl}
        alt={user.fullName}
        className="w-16 h-16 rounded-full object-cover shrink-0"
      />
    ) : (
      <div className="w-16 h-16 rounded-full bg-(--color-card) shrink-0 flex items-center justify-center">
        <User size={28} color="var(--color-slate)" />
      </div>
    )}

    <div className="flex flex-col gap-1 min-w-0">
      {user?.fullName && (
        <span className="text-lg font-bold text-(--color-ink) truncate">
          {user.fullName}
        </span>
      )}

      {user?.username && (
        <span className="text-sm text-(--color-slate)">@{user.username}</span>
      )}
    </div>
  </div>
);
