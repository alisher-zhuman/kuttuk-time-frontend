import { type InputHTMLAttributes } from "react";

import { cn } from "@shared/helpers";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = ({ label, className, ...props }: Props) => (
  <label className="flex flex-col gap-1.5">
    {label && (
      <span className="text-sm font-semibold text-(--color-hint)">{label}</span>
    )}

    <input
      className={cn(
        "w-full bg-(--color-card) border border-(--color-line) rounded-xl px-3.5 py-2.5 text-base text-(--color-ink) placeholder:text-(--color-hint) outline-none focus:border-(--color-primary) transition-colors duration-150",
        className,
      )}
      {...props}
    />
  </label>
);
