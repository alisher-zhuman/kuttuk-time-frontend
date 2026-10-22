import { type ReactNode } from "react";

import { Logo } from "../logo";

interface Props {
  title: string;
  description: string;
  action?: ReactNode;
}

// A whole-app screen shown instead of the app (outside its layout): the
// session expired, the first connection failed.
export const StatusScreen = ({ title, description, action }: Props) => (
  <div className="min-h-dvh flex flex-col items-center justify-center gap-6 bg-(--color-card) px-8 text-center">
    <Logo />

    <div className="flex flex-col items-center gap-2">
      <span className="text-xl font-extrabold tracking-tight text-(--color-ink)">{title}</span>

      <p className="text-(--color-slate) text-base leading-relaxed max-w-xs">{description}</p>
    </div>

    {action}
  </div>
);
