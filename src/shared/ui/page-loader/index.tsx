import { Loader2 } from "lucide-react";

import { cn } from "@shared/helpers";

interface Props {
  // Outside the app layout (auth, the first lazy route): fill the screen.
  fullScreen?: boolean;
}

// The spinner a screen shows while its data loads.
export const PageLoader = ({ fullScreen = false }: Props) => (
  <div
    className={cn(
      "flex items-center justify-center",
      fullScreen ? "min-h-dvh bg-(--color-bg)" : "flex-1"
    )}
  >
    <Loader2 size={28} color="var(--color-hint)" className="animate-spin" />
  </div>
);
