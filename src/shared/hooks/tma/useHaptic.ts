import { hapticFeedback } from "@tma.js/sdk-react";

const fire = (fn: () => void) => {
  if (hapticFeedback.isSupported()) fn();
};

export const useHaptic = () => ({
  // impact
  light: () => fire(() => hapticFeedback.impactOccurred("light")),
  medium: () => fire(() => hapticFeedback.impactOccurred("medium")),
  heavy: () => fire(() => hapticFeedback.impactOccurred("heavy")),
  rigid: () => fire(() => hapticFeedback.impactOccurred("rigid")),
  soft: () => fire(() => hapticFeedback.impactOccurred("soft")),

  // notification
  success: () => fire(() => hapticFeedback.notificationOccurred("success")),
  error: () => fire(() => hapticFeedback.notificationOccurred("error")),
  warning: () => fire(() => hapticFeedback.notificationOccurred("warning")),

  // selection
  selection: () => fire(() => hapticFeedback.selectionChanged()),
});
