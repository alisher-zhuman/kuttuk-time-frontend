import { type ReactNode } from "react";
import { createPortal } from "react-dom";

import { useHaptic, useSafeArea } from "@shared/hooks";

const MARGIN = 16;

interface Props {
  onClick: () => void;
  ariaLabel: string;
  children: ReactNode;
}

export const Fab = ({ onClick, ariaLabel, children }: Props) => {
  const haptic = useHaptic();

  const insets = useSafeArea();

  return createPortal(
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={() => {
        haptic.light();
        onClick();
      }}
      className="fixed z-20 flex items-center justify-center size-14 rounded-full bg-(--color-primary) text-(--color-card) cursor-pointer"
      style={{
        bottom: insets.bottom + MARGIN,
        right: insets.right + MARGIN,
        boxShadow: "var(--shadow-card)"
      }}
    >
      {children}
    </button>,
    document.body
  );
};
