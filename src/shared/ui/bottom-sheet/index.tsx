import { type PointerEvent, type ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { useSafeArea } from "@shared/hooks";

interface Props {
  title: string;
  onClose: () => void;
  // False while a request is in flight — no closing mid-save.
  dismissible?: boolean;
  // A function gets the animated close — for a "Cancel" button inside.
  children: ReactNode | ((close: () => void) => ReactNode);
}

const DURATION_MS = 220;
// Released past this share of the height, or flicked faster than this, closes.
const CLOSE_SHARE = 0.25;
const CLOSE_VELOCITY = 0.5; // px per ms

// A sheet that slides up from the bottom; closes by the backdrop, Escape or a
// swipe down on its header (only the header: a swipe over a textarea must
// still scroll / select). Portaled to <body>: <main>'s enter animation makes
// its own stacking context, so inside it even z-50 would sit under the bottom
// nav. The parent unmounting it closes it instantly (e.g. after a save).
export const BottomSheet = ({ title, onClose, dismissible = true, children }: Props) => {
  const [isShown, setIsShown] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const insets = useSafeArea();

  const panelRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startY: number; startTime: number } | null>(null);

  // Two frames: the first paints the sheet off-screen, the second starts the
  // transition from there.
  useEffect(() => {
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setIsShown(true));
    });

    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, []);

  // onClose fires when the slide-out transition ends (onTransitionEnd below).
  const close = () => {
    if (!dismissible || isClosing) return;

    // Not on screen yet — there's no transition to wait for.
    if (!isShown) {
      onClose();
      return;
    }

    setIsClosing(true);
    setIsDragging(false);
    setIsShown(false);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!dismissible) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { startY: event.clientY, startTime: performance.now() };
    setIsDragging(true);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;

    setDragOffset(Math.max(0, event.clientY - dragRef.current.startY));
  };

  const handlePointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;

    if (!drag) return;

    dragRef.current = null;
    setIsDragging(false);

    const offset = Math.max(0, event.clientY - drag.startY);
    const velocity = offset / Math.max(1, performance.now() - drag.startTime);
    const height = panelRef.current?.offsetHeight ?? Infinity;

    if (offset > height * CLOSE_SHARE || velocity > CLOSE_VELOCITY) {
      close();
    } else {
      setDragOffset(0);
    }
  };

  const transition = isDragging ? "none" : `transform ${DURATION_MS}ms ease-out`;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end"
      // Keep the layout's swipe-back handlers (React bubbles through portals)
      // out of the sheet's gestures.
      onTouchStart={(event) => event.stopPropagation()}
      onTouchEnd={(event) => event.stopPropagation()}
    >
      <div
        aria-hidden="true"
        onClick={close}
        className="absolute inset-0 bg-black/40"
        style={{ opacity: isShown ? 1 : 0, transition: `opacity ${DURATION_MS}ms ease-out` }}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onTransitionEnd={(event) => {
          if (isClosing && event.target === event.currentTarget && event.propertyName === "transform") {
            onClose();
          }
        }}
        className="relative w-full flex flex-col gap-4 px-4 rounded-t-3xl bg-(--color-bg)"
        style={{
          // Above the home indicator; the layout's padding doesn't reach a portal.
          paddingBottom: insets.bottom + 24,
          transform: isShown ? `translateY(${dragOffset}px)` : "translateY(100%)",
          transition
        }}
      >
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          className="flex flex-col gap-3 pt-2.5 touch-none select-none cursor-grab"
        >
          <span className="self-center w-10 h-1 rounded-full bg-(--color-line)" />
          <h2 className="text-lg font-extrabold text-(--color-ink)">{title}</h2>
        </div>

        {typeof children === "function" ? children(close) : children}
      </div>
    </div>,
    document.body
  );
};
