import { type ReactNode } from "react";

import { cn } from "@shared/helpers";

interface Props {
  icon: ReactNode;
  message: string;
  action?: ReactNode;
  // "page" fills the viewport (not-found screens), "section" sits inside a list
  variant?: "page" | "section";
}

export const EmptyState = ({ icon, message, action, variant = "section" }: Props) => (
  <div
    className={cn(
      "flex flex-col items-center text-(--color-hint)",
      variant === "page" ? "flex-1 justify-center gap-4" : "gap-3 py-14"
    )}
  >
    <span className="size-16 rounded-2xl bg-(--color-chip) flex items-center justify-center">
      {icon}
    </span>

    <p className="text-sm font-semibold">{message}</p>

    {action}
  </div>
);
