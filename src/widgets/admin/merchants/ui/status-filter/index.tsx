import { useTranslation } from "react-i18next";

import { SegmentedControl } from "@shared/ui";

type StatusValue = "all" | "active" | "inactive";

const STATUS_VALUES: Record<StatusValue, boolean | null> = {
  all: null,
  active: true,
  inactive: false,
};

interface Props {
  active: boolean | null;
  onChange: (isActive: boolean | null) => void;
}

export const AdminMerchantStatusFilter = ({ active, onChange }: Props) => {
  const { t } = useTranslation();

  const value: StatusValue =
    active === null ? "all" : active ? "active" : "inactive";

  const items = (["all", "active", "inactive"] as const).map((status) => ({
    value: status,
    label: t(status === "all" ? "categories.all" : `admin.merchants.${status}`),
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
