import { type TouchEvent, useRef } from "react";

import { useAppModeStore } from "@shared/store";

import { useGoBack } from "./useGoBack";

const THRESHOLD = 75;
const EDGE_ZONE = 30;

// A swipe right from the left edge = the Back button (same target, nothing on
// root screens). No "forward" swipe: Telegram has no forward button to match.
// Not on the website: the browser's own edge swipe already goes back - two
// steps back for one swipe otherwise.
export const useSwipeNavigation = () => {
  const startX = useRef<number | null>(null);

  const { isRoot, goBack } = useGoBack();

  const isWeb = useAppModeStore((s) => s.mode === "web");

  const onTouchStart = (e: TouchEvent) => {
    if (isWeb) return;

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
