import { ClipboardList, Store, Wallet } from "lucide-react";

import { ROUTE_PATTERNS } from "@shared/constants";

export const ADMIN_NAV_TABS = [
  { path: ROUTE_PATTERNS.ADMIN_MERCHANTS, labelKey: "admin.nav.merchants", icon: Store },
  { path: ROUTE_PATTERNS.ADMIN_ORDERS, labelKey: "admin.nav.orders", icon: ClipboardList },
  { path: ROUTE_PATTERNS.ADMIN_PAYMENTS, labelKey: "admin.nav.payments", icon: Wallet }
] as const;

export const ADMIN_NAV_PATHS: readonly string[] = ADMIN_NAV_TABS.map((tab) => tab.path);
