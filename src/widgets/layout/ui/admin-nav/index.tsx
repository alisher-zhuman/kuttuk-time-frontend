import { useLocation } from "react-router";

import { useTranslation } from "react-i18next";

import { Receipt, Store, Wallet } from "lucide-react";

import { ROUTE_PATTERNS } from "@shared/constants";
import { cn } from "@shared/helpers";
import { useHaptic, useNavigateTo } from "@shared/hooks";

const TABS = [
  { path: ROUTE_PATTERNS.ADMIN_MERCHANTS, labelKey: "admin.nav.merchants", icon: Store },
  { path: ROUTE_PATTERNS.ADMIN_ORDERS, labelKey: "admin.nav.orders", icon: Receipt },
  { path: ROUTE_PATTERNS.ADMIN_PAYMENTS, labelKey: "admin.nav.payments", icon: Wallet },
] as const;

export const AdminNav = () => {
  const { t } = useTranslation();

  const navigateTo = useNavigateTo();

  const haptic = useHaptic();

  const { pathname } = useLocation();

  return (
    <nav className="flex items-center justify-around border-t border-(--color-line) bg-(--color-card) py-2">
      {TABS.map(({ path, labelKey, icon: Icon }) => {
        const isActive = pathname === path;

        return (
          <button
            key={path}
            type="button"
            onClick={() => {
              haptic.selection();
              navigateTo(path);
            }}
            className={cn(
              "flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl cursor-pointer transition-colors duration-150",
              isActive ? "text-(--color-primary)" : "text-(--color-hint)",
            )}
          >
            <Icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
            <span className="text-xs font-semibold">{t(labelKey)}</span>
          </button>
        );
      })}
    </nav>
  );
};
