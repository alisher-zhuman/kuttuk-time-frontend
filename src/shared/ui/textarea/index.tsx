import { type Ref, type TextareaHTMLAttributes } from "react";

import { cn } from "@shared/helpers";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string | undefined;
  error?: string | undefined;
  ref?: Ref<HTMLTextAreaElement>;
}

export const Textarea = ({ label, error, className, ref, ...props }: Props) => (
  <label className="flex flex-col gap-1.5">
    {label && (
      <span className="text-sm font-semibold text-(--color-hint)">{label}</span>
    )}

    <textarea
      ref={ref}
      rows={3}
      className={cn(
        "w-full bg-(--color-card) border rounded-xl px-3.5 py-2.5 text-base text-(--color-ink) placeholder:text-(--color-hint) outline-none resize-none transition-colors duration-150",
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
