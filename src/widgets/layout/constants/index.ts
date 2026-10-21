import {
  ChartColumn,
  ClipboardList,
  ScanLine,
  Store,
  Ticket,
  UsersRound,
  Wallet
} from "lucide-react";

import { ROUTE_PATTERNS } from "@shared/constants";

export interface NavTab {
  path: string;
  labelKey: string;
  icon: typeof Store;
}

// Bottom nav per view mode; the buyer has none (footer instead).
export const NAV_TABS: Partial<Record<string, readonly NavTab[]>> = {
  admin: [
    { path: ROUTE_PATTERNS.ADMIN_VENUES, labelKey: "admin.nav.venues", icon: Store },
    { path: ROUTE_PATTERNS.ADMIN_MERCHANTS, labelKey: "admin.nav.merchants", icon: UsersRound },
    { path: ROUTE_PATTERNS.ADMIN_ORDERS, labelKey: "admin.nav.orders", icon: ClipboardList },
    { path: ROUTE_PATTERNS.ADMIN_PAYMENTS, labelKey: "admin.nav.payments", icon: Wallet }
  ],
  merchant: [
    { path: ROUTE_PATTERNS.MERCHANT_HOME, labelKey: "merchant.nav.venues", icon: Store },
    { path: ROUTE_PATTERNS.MERCHANT_SUMMARY, labelKey: "merchant.nav.summary", icon: ChartColumn },
    { path: ROUTE_PATTERNS.MERCHANT_CERTIFICATES, labelKey: "merchant.nav.certificates", icon: Ticket },
    { path: ROUTE_PATTERNS.MERCHANT_REDEEM, labelKey: "merchant.nav.redeem", icon: ScanLine }
  ]
};
