import { type TouchEvent, useRef } from "react";

import { useGoBack } from "./useGoBack";

const THRESHOLD = 75;
const EDGE_ZONE = 30;

// A swipe right from the left edge = the Back button (same target, nothing on
// root screens). No "forward" swipe: Telegram has no forward button to match.
export const useSwipeNavigation = () => {
  const startX = useRef<number | null>(null);

  const { isRoot, goBack } = useGoBack();

  const onTouchStart = (e: TouchEvent) => {
    const x = e.touches[0]?.clientX;

    startX.current = x !== undefined && x <= EDGE_ZONE ? x : null;
  };

  const onTouchEnd = (e: TouchEvent) => {
    const start = startX.current;
    const endX = e.changedTouches[0]?.clientX;

    startX.current = null;

    if (start === null || endX === undefined || isRoot) return;

    if (endX - start > THRESHOLD) goBack();
  };

  return { onTouchStart, onTouchEnd };
};
