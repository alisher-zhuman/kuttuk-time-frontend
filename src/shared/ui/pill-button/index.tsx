import { type ButtonHTMLAttributes } from "react";

import { cn } from "@shared/helpers";

// The app's main round button on full-screen states (errors, not found,
// session expired) and empty lists.
export const PillButton = ({
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    type={type}
    className={cn(
      "px-6 py-3 rounded-full bg-(--color-primary) text-(--color-card) font-semibold text-sm cursor-pointer",
      className
    )}
    {...props}
  />
);
