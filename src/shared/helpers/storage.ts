import { getLaunchParams } from "./tma";

export const getScopedStorageKey = (key: string): string => {
  const telegramId = getLaunchParams()?.tgWebAppData?.user?.id;

  return telegramId != null ? `${key}-${telegramId}` : key;
};
