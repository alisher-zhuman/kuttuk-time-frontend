import { openLink, retrieveLaunchParams } from "@tma.js/sdk-react";

import type { TmaUserInfo } from "../types";

type LaunchParams = ReturnType<typeof retrieveLaunchParams>;

let cached: LaunchParams | null | undefined;

export const getLaunchParams = (): LaunchParams | null => {
  if (cached !== undefined) return cached;

  try {
    cached = retrieveLaunchParams();
  } catch {
    return null;
  }

  return cached;
};

export const getTMAUserInfo = (): TmaUserInfo | null => {
  const user = getLaunchParams()?.tgWebAppData?.user;

  if (!user) return null;

  return {
    id: user.id,
    fullName: [user.first_name, user.last_name].filter(Boolean).join(" "),
    username: user.username ?? null,
    photoUrl: user.photo_url ?? null
  };
};

// openLink keeps the Mini App open (unlike openTelegramLink / location
// changes), so polling survives while the user pays in the bank's page.
// Telegram may ignore it outside a user gesture — callers after an await
// should also offer a button that opens the link again.
export const openExternalLink = (url: string) => {
  if (openLink.isAvailable()) {
    try {
      openLink(url);
      return;
    } catch {
      // Fall through to the browser API.
    }
  }

  window.open(url, "_blank", "noopener,noreferrer");
};
