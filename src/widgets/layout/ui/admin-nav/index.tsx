import { useLocation } from "react-router";

import { useTranslation } from "react-i18next";

import { ClipboardList, Store, Wallet } from "lucide-react";

import { ROUTE_PATTERNS } from "@shared/constants";
import { cn } from "@shared/helpers";
import { useHaptic, useNavigateTo } from "@shared/hooks";

const TABS = [
  { path: ROUTE_PATTERNS.ADMIN_MERCHANTS, labelKey: "admin.nav.merchants", icon: Store },
  { path: ROUTE_PATTERNS.ADMIN_ORDERS, labelKey: "admin.nav.orders", icon: ClipboardList },
  { path: ROUTE_PATTERNS.ADMIN_PAYMENTS, labelKey: "admin.nav.payments", icon: Wallet },
] as const;

export const AdminNav = () => {
  const { t } = useTranslation();

  const navigateTo = useNavigateTo();

  const haptic = useHaptic();

  const { pathname } = useLocation();

  return (
    <nav
      className="mx-4 mb-4 flex items-center gap-1 rounded-3xl bg-(--color-card) p-1.5"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      {TABS.map(({ path, labelKey, icon: Icon }) => {
        const isActive = pathname === path;

        return (
          <button
            key={path}
            type="button"
            onClick={() => {
              haptic.selection();
              navigateTo(path, { replace: true });
            }}
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 rounded-2xl py-2.5 cursor-pointer transition-colors duration-150",
              isActive
                ? "bg-(--color-primary) text-(--color-card)"
                : "text-(--color-hint)",
            )}
          >
            <Icon size={19} strokeWidth={isActive ? 2.2 : 1.8} />
            <span className="text-xs font-semibold">{t(labelKey)}</span>
          </button>
        );
      })}
    </nav>
  );
};
