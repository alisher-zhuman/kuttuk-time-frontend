import { useTranslation } from "react-i18next";

import { useAuthStore, useViewModeStore } from "@shared/store";
import { SegmentedControl } from "@shared/ui";

export const AdminModeSection = () => {
  const { t } = useTranslation();

  const role = useAuthStore((s) => s.role);
  const viewMode = useViewModeStore((s) => s.viewMode);
  const setViewMode = useViewModeStore((s) => s.setViewMode);

  if (role !== "admin") return null;

  const items = [
    { value: "user" as const, label: t("admin.viewAsUser") },
    { value: "admin" as const, label: t("admin.viewAsAdmin") },
  ];

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold text-(--color-slate) uppercase tracking-wider px-1">
        {t("admin.label")}
      </span>

      <SegmentedControl items={items} value={viewMode} onChange={setViewMode} />
    </div>
  );
};
