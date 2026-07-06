import { useTranslation } from "react-i18next";

import { VIEW_MODES } from "@shared/constants";
import { useAuthStore, useViewModeStore } from "@shared/store";
import { SegmentedControl } from "@shared/ui";

const VIEW_MODE_LABELS = {
  user: "admin.viewAsUser",
  admin: "admin.viewAsAdmin",
} as const;

export const AdminModeSection = () => {
  const { t } = useTranslation();

  const role = useAuthStore((s) => s.role);
  const viewMode = useViewModeStore((s) => s.viewMode);
  const setViewMode = useViewModeStore((s) => s.setViewMode);

  if (role !== "admin") return null;

  const items = VIEW_MODES.map((mode) => ({
    value: mode,
    label: t(VIEW_MODE_LABELS[mode]),
  }));

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold text-(--color-slate) uppercase tracking-wider px-1">
        {t("admin.label")}
      </span>

      <SegmentedControl items={items} value={viewMode} onChange={setViewMode} />
    </div>
  );
};
