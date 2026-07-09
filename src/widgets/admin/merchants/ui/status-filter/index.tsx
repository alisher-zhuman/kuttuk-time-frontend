import { useTranslation } from "react-i18next";

import { Plus } from "lucide-react";

import { useHaptic } from "@shared/hooks";
import { SegmentedControl } from "@shared/ui";

type StatusValue = "active" | "inactive";

const STATUS_VALUES: Record<StatusValue, boolean> = {
  active: true,
  inactive: false
};

interface Props {
  active: boolean;
  onChange: (isActive: boolean) => void;
  onCreate: () => void;
}

export const AdminMerchantStatusFilter = ({ active, onChange, onCreate }: Props) => {
  const { t } = useTranslation();

  const haptic = useHaptic();

  const value: StatusValue = active ? "active" : "inactive";

  const items = (["active", "inactive"] as const).map((status) => ({
    value: status,
    label: t(`admin.merchants.${status}`)
  }));

  return (
    <div className="mt-3.5 flex items-center gap-2">
      <div className="flex-1">
        <SegmentedControl
          items={items}
          value={value}
          onChange={(next) => onChange(STATUS_VALUES[next])}
        />
      </div>

      <button
        type="button"
        aria-label={t("admin.merchants.form.create")}
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
