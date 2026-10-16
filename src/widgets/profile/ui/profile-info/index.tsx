import { useState } from "react";

import { useTranslation } from "react-i18next";

import { Check, Copy, User } from "lucide-react";

import { useCopyToClipboard, useHaptic } from "@shared/hooks";
import type { TmaUserInfo } from "@shared/types";

interface Props {
  user: TmaUserInfo | null;
}

export const ProfileInfo = ({ user }: Props) => {
  const [copied, setCopied] = useState(false);

  const { t } = useTranslation();

  const haptic = useHaptic();

  const copyToClipboard = useCopyToClipboard();

  const handleCopyId = async () => {
    if (!user) return;

    haptic.light();

    if (await copyToClipboard(String(user.id))) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
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

        {user && (
          <button
            type="button"
            onClick={() => void handleCopyId()}
            className="flex items-center gap-1 w-fit text-xs font-semibold text-(--color-hint) cursor-pointer"
          >
            {t("profile.id")}: {user.id}
            {copied ? <Check size={12} /> : <Copy size={12} />}
          </button>
        )}
      </div>
    </div>
  );
};
