import { FieldLabel } from "@shared/ui";

interface Props {
  label: string;
  value: string | number;
}

export const MerchantDetailMetaField = ({ label, value }: Props) => (
  <div className="flex flex-col gap-1">
    <FieldLabel>{label}</FieldLabel>

    <p className="text-sm font-bold text-(--color-ink) px-1">{value}</p>
  </div>
);
