import { useTranslation } from "react-i18next";

import { SegmentedControl } from "@shared/ui";

type StatusValue = "active" | "inactive";

const STATUS_VALUES: Record<StatusValue, boolean> = {
  active: true,
  inactive: false
};

interface Props {
  active: boolean;
  onChange: (isActive: boolean) => void;
}

export const AdminMerchantStatusFilter = ({ active, onChange }: Props) => {
  const { t } = useTranslation();

  const value: StatusValue = active ? "active" : "inactive";

  const items = (["active", "inactive"] as const).map((status) => ({
    value: status,
    label: t(`admin.merchants.${status}`)
  }));

  return (
    <div className="mt-3.5">
      <SegmentedControl
        items={items}
        value={value}
        onChange={(next) => onChange(STATUS_VALUES[next])}
      />
    </div>
  );
};
