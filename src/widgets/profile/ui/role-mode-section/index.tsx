import { useTranslation } from "react-i18next";

import { getHomeRoute, type ViewMode } from "@shared/constants";
import { useNavigateTo } from "@shared/hooks";
import { useViewModeStore } from "@shared/store";
import { SegmentedControl } from "@shared/ui";

interface Props {
  role: "admin" | "merchant";
}

// Privileged roles (admin, merchant) get a toggle to preview the app as a plain
// buyer. One account is never both roles at once, so this is always a binary
// {user, own role} control — hence the `role` prop instead of a 3-way switch.
export const RoleModeSection = ({ role }: Props) => {
  const { t } = useTranslation();

  const navigateTo = useNavigateTo();

  const viewMode = useViewModeStore((s) => s.viewMode);
  const setViewMode = useViewModeStore((s) => s.setViewMode);

  const items: { value: ViewMode; label: string }[] = [
    { value: "user", label: t(`${role}.viewAsUser`) },
    {
      value: role,
      label: t(role === "admin" ? "admin.viewAsAdmin" : "merchant.viewAsMerchant")
    }
  ];

  const handleChange = (mode: ViewMode) => {
    setViewMode(mode);
    navigateTo(getHomeRoute(mode));
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold text-(--color-slate) uppercase tracking-wider px-1">
        {t(`${role}.label`)}
      </span>

      <SegmentedControl items={items} value={viewMode} onChange={handleChange} />
    </div>
  );
};
