import { useTranslation } from "react-i18next";

import { ROUTE_PATTERNS, VIEW_MODES, type ViewMode } from "@shared/constants";
import { useNavigateTo } from "@shared/hooks";
import { useViewModeStore } from "@shared/store";
import { SegmentedControl } from "@shared/ui";

const VIEW_MODE_LABELS = {
  user: "admin.viewAsUser",
  admin: "admin.viewAsAdmin",
} as const;

export const AdminModeSection = () => {
  const { t } = useTranslation();

  const navigateTo = useNavigateTo();

  const viewMode = useViewModeStore((s) => s.viewMode);
  const setViewMode = useViewModeStore((s) => s.setViewMode);

  const items = VIEW_MODES.map((mode) => ({
    value: mode,
    label: t(VIEW_MODE_LABELS[mode]),
  }));

  const handleChange = (mode: ViewMode) => {
    setViewMode(mode);
    navigateTo(
      mode === "admin" ? ROUTE_PATTERNS.ADMIN_MERCHANTS : ROUTE_PATTERNS.HOME,
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold text-(--color-slate) uppercase tracking-wider px-1">
        {t("admin.label")}
      </span>

      <SegmentedControl
        items={items}
        value={viewMode}
        onChange={handleChange}
      />
    </div>
  );
};
