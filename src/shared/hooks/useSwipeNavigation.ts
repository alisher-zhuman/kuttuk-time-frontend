import { useRef } from "react";
import { useNavigate } from "react-router";

const THRESHOLD = 75;
const EDGE_ZONE = 30;

export const useSwipeNavigation = () => {
  const navigate = useNavigate();

  const startX = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    const x = e.touches[0]?.clientX ?? null;

    if (x === null) return;

    const fromLeftEdge = x <= EDGE_ZONE;
    const fromRightEdge = x >= window.innerWidth - EDGE_ZONE;

    if (!fromLeftEdge && !fromRightEdge) return;

    startX.current = x;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current === null) {
      return;
    }

    const endX = e.changedTouches[0]?.clientX;

    if (endX === undefined) {
      return;
    }

    const diff = endX - startX.current;
    startX.current = null;

    if (diff > THRESHOLD) {
      void navigate(-1);
    } else if (diff < -THRESHOLD) {
      void navigate(1);
    }
  };

  return { onTouchStart, onTouchEnd };
};
