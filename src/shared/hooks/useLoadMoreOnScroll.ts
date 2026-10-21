import { useEffect, useState } from "react";

// Calls onReach when the sentinel element scrolls into view (infinite list).
export const useLoadMoreOnScroll = (onReach: () => void, enabled: boolean) => {
  const [sentinel, setSentinel] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!sentinel || !enabled) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          onReach();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [sentinel, enabled, onReach]);

  return setSentinel;
};
