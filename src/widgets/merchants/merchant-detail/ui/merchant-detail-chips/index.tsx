import { FieldLabel } from "@shared/ui";

interface Props {
  label: string;
  items: { key: string | number; label: string }[];
}

export const MerchantDetailChips = ({ label, items }: Props) => (
  <div className="flex flex-col gap-2.5">
    <FieldLabel>{label}</FieldLabel>

    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item.key}
          className="px-3 py-1.5 rounded-full text-sm font-bold bg-(--color-chip) text-(--color-chip-ink) border border-(--color-line)"
        >
          {item.label}
        </span>
      ))}
    </div>
  </div>
);
