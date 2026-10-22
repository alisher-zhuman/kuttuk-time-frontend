import { useMemo } from "react";

import { cn, encodeQr } from "@shared/helpers";

interface Props {
  value: string;
  label: string;
  className?: string;
}

// Always black on white (not themed): phone cameras read dark-on-light best,
// also from a dark-mode screen.
export const QrCode = ({ value, label, className }: Props) => {
  const { size, path } = useMemo(() => encodeQr(value), [value]);

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={label}
      shapeRendering="crispEdges"
      className={cn("rounded-2xl bg-white p-2", className)}
    >
      <path d={path} fill="#000" />
    </svg>
  );
};
