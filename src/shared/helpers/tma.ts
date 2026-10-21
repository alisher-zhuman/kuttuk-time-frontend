import { openLink, requestWriteAccess, retrieveLaunchParams } from "@tma.js/sdk-react";

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

// Whether the bot may message the user (sale notices, the certificate code).
// initData is fixed for the session, so a grant made now is remembered here.
let writeAccess: boolean | undefined;
let hasAsked = false;

export const hasWriteAccess = () =>
  (writeAccess ??= getLaunchParams()?.tgWebAppData?.user?.allows_write_to_pm === true);

// Native "allow messages from the bot" prompt. Resolves to whether access is
// granted; never throws — a refusal or an old client must not block anything.
// oncePerSession: an unprompted ask (the purchase) — after a refusal, don't nag
// on every purchase; an explicit button asks every time.
export const requestBotMessages = async (
  { oncePerSession = false }: { oncePerSession?: boolean } = {}
): Promise<boolean> => {
  if (hasWriteAccess()) return true;

  if (!requestWriteAccess.isAvailable() || (oncePerSession && hasAsked)) return false;

  hasAsked = true;

  try {
    writeAccess = (await requestWriteAccess()) === "allowed";
  } catch {
    return false;
  }

  return writeAccess;
};
