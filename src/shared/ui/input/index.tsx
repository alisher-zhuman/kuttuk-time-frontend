import { type InputHTMLAttributes, type Ref } from "react";

import { cn } from "@shared/helpers";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string | undefined;
  error?: string | undefined;
  ref?: Ref<HTMLInputElement>;
}

export const Input = ({ label, error, className, ref, ...props }: Props) => (
  <label className="flex flex-col gap-1.5">
    {label && (
      <span className="text-sm font-semibold text-(--color-hint)">{label}</span>
    )}

    <input
      ref={ref}
      className={cn(
        "w-full bg-(--color-card) border rounded-xl px-3.5 py-2.5 text-base text-(--color-ink) placeholder:text-(--color-hint) outline-none transition-colors duration-150",
        error
          ? "border-(--color-accent)"
          : "border-(--color-line) focus:border-(--color-primary)",
        className
      )}
      {...props}
    />

    {error && (
      <span className="text-xs font-semibold text-(--color-accent)">{error}</span>
    )}
  </label>
);
