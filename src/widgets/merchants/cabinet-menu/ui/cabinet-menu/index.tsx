import { useTranslation } from "react-i18next";

import { ChartColumn, ChevronRight, Ticket } from "lucide-react";

import { ROUTE_PATTERNS } from "@shared/constants";
import { useHaptic, useNavigateTo } from "@shared/hooks";

const ITEMS = [
  { path: ROUTE_PATTERNS.MERCHANT_SUMMARY, labelKey: "merchant.summary.title", icon: ChartColumn },
  { path: ROUTE_PATTERNS.MERCHANT_CERTIFICATES, labelKey: "merchant.certificates.title", icon: Ticket }
] as const;

// Entry points of the cabinet next to the "Redeem" MainButton. Shown when the
// venue is deactivated too — the owner still sees its numbers and codes.
export const CabinetMenu = () => {
  const { t } = useTranslation();

  const navigateTo = useNavigateTo();

  const haptic = useHaptic();

  return (
    <nav className="flex flex-col gap-2">
      {ITEMS.map(({ path, labelKey, icon: Icon }) => (
        <button
          key={path}
          type="button"
          onClick={() => {
            haptic.light();
            navigateTo(path);
          }}
          className="flex items-center gap-3 p-3 rounded-2xl bg-(--color-card) border border-(--color-line) text-left cursor-pointer"
        >
          <Icon size={20} className="text-(--color-primary) shrink-0" />
          <span className="flex-1 text-sm font-bold text-(--color-ink)">{t(labelKey)}</span>
          <ChevronRight size={17} className="text-(--color-hint)" />
        </button>
      ))}
    </nav>
  );
};
