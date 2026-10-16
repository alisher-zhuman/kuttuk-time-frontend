import { useTranslation } from "react-i18next";

import { SegmentedControl } from "@shared/ui";

type StatusValue = "active" | "inactive";

const STATUS_VALUES: Record<StatusValue, boolean> = {
  active: true,
  inactive: false
};

interface Props {
  value: boolean;
  onChange: (isActive: boolean) => void;
}

export const ActiveToggle = ({ value, onChange }: Props) => {
  const { t } = useTranslation();

  const selected: StatusValue = value ? "active" : "inactive";

  const items = (["active", "inactive"] as const).map((status) => ({
    value: status,
    label: t(`admin.merchants.${status}`)
  }));

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold text-(--color-hint)">
        {t("admin.merchants.form.status")}
      </span>

      <SegmentedControl
        items={items}
        value={selected}
        onChange={(next) => onChange(STATUS_VALUES[next])}
      />
    </div>
  );
};
