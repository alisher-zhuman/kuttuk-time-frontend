import { Plus } from "lucide-react";

import { useHaptic } from "@shared/hooks";

import { SegmentedControl } from "../segmented-control";

type StatusValue = "active" | "inactive";

interface Props {
  active: boolean;
  onChange: (isActive: boolean) => void;
  onCreate: () => void;
  labels: { active: string; inactive: string; create: string };
}

// Active / inactive switch for admin lists, with the "create" button beside it.
export const ActiveFilter = ({ active, onChange, onCreate, labels }: Props) => {
  const haptic = useHaptic();

  const items = (["active", "inactive"] as const).map((status) => ({
    value: status,
    label: labels[status]
  }));

  return (
    <div className="mt-3.5 flex items-center gap-2">
      <div className="flex-1">
        <SegmentedControl
          items={items}
          value={active ? "active" : "inactive"}
          onChange={(next: StatusValue) => onChange(next === "active")}
        />
      </div>

      <button
        type="button"
        aria-label={labels.create}
        onClick={() => {
          haptic.light();
          onCreate();
        }}
        className="shrink-0 size-11 rounded-xl bg-(--color-primary) text-(--color-card) flex items-center justify-center cursor-pointer"
      >
        <Plus size={20} />
      </button>
    </div>
  );
};
