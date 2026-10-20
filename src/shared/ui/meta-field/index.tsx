import { type ReactNode } from "react";

import { FieldLabel } from "../field-label";

interface Props {
  label: string;
  value: ReactNode;
}

// A labelled read-only value on detail screens.
export const MetaField = ({ label, value }: Props) => (
  <div className="flex flex-col gap-1">
    <FieldLabel>{label}</FieldLabel>

    <div className="text-sm font-bold text-(--color-ink) px-1">{value}</div>
  </div>
);
