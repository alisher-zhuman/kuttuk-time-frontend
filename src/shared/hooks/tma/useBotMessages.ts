import { useCallback, useState } from "react";

import { hasWriteAccess, requestBotMessages } from "@shared/helpers";

import { useHaptic } from "./useHaptic";

// Whether the bot may message the user, and the native "allow" prompt. Asks on
// every call until allowed - for an explicit button; a refusal keeps it.
export const useBotMessages = () => {
  const [isAllowed, setIsAllowed] = useState(hasWriteAccess);
  const [isRequesting, setIsRequesting] = useState(false);

  const haptic = useHaptic();

  const allow = useCallback(async () => {
    haptic.light();
    setIsRequesting(true);

    const granted = await requestBotMessages();

    setIsRequesting(false);
    setIsAllowed(granted);

    if (granted) haptic.success();
  }, [haptic]);

  return { isAllowed, isRequesting, allow };
};
