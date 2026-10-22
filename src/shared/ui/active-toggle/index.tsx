import { SegmentedControl } from "../segmented-control";

interface Props {
  value: boolean;
  onChange: (isActive: boolean) => void;
  labels: { title: string; active: string; inactive: string };
}

// Active / inactive switch inside admin edit forms.
export const ActiveToggle = ({ value, onChange, labels }: Props) => (
  <div className="flex flex-col gap-1.5">
    <span className="text-sm font-semibold text-(--color-hint)">{labels.title}</span>

    <SegmentedControl
      items={[
        { value: "active", label: labels.active },
        { value: "inactive", label: labels.inactive }
      ]}
      value={value ? "active" : "inactive"}
      onChange={(next) => onChange(next === "active")}
    />
  </div>
);
