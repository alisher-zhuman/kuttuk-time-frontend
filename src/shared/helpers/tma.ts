import { retrieveLaunchParams } from "@tma.js/sdk-react";

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
    fullName: [user.first_name, user.last_name].filter(Boolean).join(" "),
    username: user.username ?? null,
    photoUrl: user.photo_url ?? null,
  };
};
