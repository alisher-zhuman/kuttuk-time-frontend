import { type ReactNode } from "react";

import { useTranslation } from "react-i18next";

import { cn, formatMoney } from "@shared/helpers";

interface Props {
  icon: ReactNode;
  tone: "success" | "neutral" | "warning";
  title: string;
  description?: string;
  venueName: string | undefined;
  amount: number;
  children?: ReactNode;
}

// Shared frame of the final order screens (paid / expired / needs_review).
export const OrderResult = ({
  icon,
  tone,
  title,
  description,
  venueName,
  amount,
  children
}: Props) => {
  const { t } = useTranslation();

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-5 py-8 text-center">
      <span
        className={cn(
          "size-16 rounded-2xl flex items-center justify-center",
          tone === "success" && "bg-(--color-green-tint) text-(--color-green)",
          tone === "neutral" && "bg-(--color-chip) text-(--color-hint)",
          tone === "warning" && "bg-(--color-accent-tint) text-(--color-accent)"
        )}
      >
        {icon}
      </span>

      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-extrabold tracking-tight text-(--color-ink)">{title}</h1>

        {description && (
          <p className="text-sm text-(--color-slate) max-w-xs">{description}</p>
        )}
      </div>

      <div className="flex flex-col gap-1 px-5 py-4 rounded-2xl bg-(--color-card) border border-(--color-line) min-w-56">
        {venueName && (
          <span className="text-sm font-semibold text-(--color-slate)">{venueName}</span>
        )}

        <span className="text-2xl font-extrabold text-(--color-ink)">
          {formatMoney(amount, t("certificate.currency"))}
        </span>
      </div>

      {children}
    </div>
  );
};
