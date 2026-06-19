import { useSignal, viewport } from "@tma.js/sdk-react";

export const useSafeArea = () => {
  const content = useSignal(viewport.contentSafeAreaInsets);
  const safe = useSignal(viewport.safeAreaInsets);

  return {
    top: safe.top + content.top,
    right: safe.right + content.right,
    bottom: safe.bottom + content.bottom,
    left: safe.left + content.left,
  };
};
