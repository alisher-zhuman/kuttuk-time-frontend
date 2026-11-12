import { type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

// Rows that belong together in one card, split by hairlines - like a group in
// Telegram's settings. Takes RowButtons as they are: their own card look is
// dropped inside the group.
export const RowGroup = ({ children }: Props) => (
  <div className="flex flex-col rounded-2xl bg-(--color-card) border border-(--color-line) divide-y divide-(--color-line) overflow-hidden [&>button]:rounded-none [&>button]:border-0 [&>button]:bg-transparent">
    {children}
  </div>
);
