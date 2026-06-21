import { retrieveLaunchParams } from "@tma.js/sdk-react";

import type { TmaUserInfo } from "../types";

export const getTMAUserInfo = (): TmaUserInfo | null => {
  try {
    const user = retrieveLaunchParams().tgWebAppData?.user;
    if (!user) return null;

    return {
      fullName: [user.first_name, user.last_name].filter(Boolean).join(" "),
      username: user.username ?? null,
      photoUrl: user.photo_url ?? null,
    };
  } catch {
    return null;
  }
};
