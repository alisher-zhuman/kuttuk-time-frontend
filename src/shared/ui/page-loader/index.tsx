import { Loader2 } from "lucide-react";

import { cn } from "@shared/helpers";

interface Props {
  // Outside the app layout (auth, the first lazy route): fill the screen.
  fullScreen?: boolean;
  // Under the spinner - why it may take a while.
  message?: string | undefined;
}

// The spinner a screen shows while its data loads.
export const PageLoader = ({ fullScreen = false, message }: Props) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center gap-3 px-6",
      fullScreen ? "min-h-dvh bg-(--color-bg)" : "flex-1"
    )}
  >
    <Loader2 size={28} color="var(--color-hint)" className="animate-spin" />

    {message && (
      <span role="status" className="text-sm text-(--color-slate) text-center max-w-xs">
        {message}
      </span>
    )}
  </div>
);
