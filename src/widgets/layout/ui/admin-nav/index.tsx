import { useLocation } from "react-router";

import { useTranslation } from "react-i18next";

import { ClipboardList, Store, Wallet } from "lucide-react";

import { ROUTE_PATTERNS } from "@shared/constants";
import { useNavigateTo } from "@shared/hooks";
import { SegmentedControl } from "@shared/ui";

const TABS = [
  { path: ROUTE_PATTERNS.ADMIN_MERCHANTS, labelKey: "admin.nav.merchants", icon: Store },
  { path: ROUTE_PATTERNS.ADMIN_ORDERS, labelKey: "admin.nav.orders", icon: ClipboardList },
  { path: ROUTE_PATTERNS.ADMIN_PAYMENTS, labelKey: "admin.nav.payments", icon: Wallet },
] as const;

export const AdminNav = () => {
  const { t } = useTranslation();

  const navigateTo = useNavigateTo();

  const { pathname } = useLocation();

  const items = TABS.map(({ path, labelKey, icon: Icon }) => ({
    value: path,
    label: (
      <span className="flex items-center gap-1.5">
        <Icon size={14} />
        {t(labelKey)}
      </span>
    ),
  }));

  return (
    <div className="mx-4 mb-4">
      <SegmentedControl
        items={items}
        value={pathname}
        onChange={(path) => navigateTo(path, { replace: true })}
      />
    </div>
  );
};
