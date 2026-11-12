import { useLocation } from "react-router";

import { useTranslation } from "react-i18next";

import { Shield, Store, User } from "lucide-react";

import { getHomeRoute, ROUTE_PATTERNS } from "@shared/constants";
import { useHaptic, useNavigateTo } from "@shared/hooks";
import { useViewModeStore } from "@shared/store";
import { LangSwitcher, Logo } from "@shared/ui";

interface Props {
  className?: string;
}

export const Header = ({ className = "" }: Props) => {
  const { t } = useTranslation();

  const navigateTo = useNavigateTo();

  const haptic = useHaptic();

  const viewMode = useViewModeStore((s) => s.viewMode);

  const isOnProfile = useLocation().pathname === ROUTE_PATTERNS.PROFILE;

  return (
    <header className={`px-4 h-12 flex items-center justify-between gap-2.5 ${className}`}>
      <button
        type="button"
        onClick={() => {
          haptic.light();
          navigateTo(getHomeRoute(viewMode));
        }}
        className="flex items-center gap-2 leading-none cursor-pointer min-w-0"
      >
        <Logo />

        {viewMode === "admin" && (
          <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-(--color-primary) text-(--color-card) text-xs font-bold shrink-0">
            <Shield size={12} aria-label={t("admin.badge")} />
            {/* Below 360 px the word ran under the language switch. */}
            <span className="hidden min-[360px]:inline">{t("admin.badge")}</span>
          </span>
        )}

        {viewMode === "merchant" && (
          <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-(--color-primary) text-(--color-card) text-xs font-bold shrink-0">
            <Store size={12} aria-label={t("merchant.badge")} />
            <span className="hidden min-[360px]:inline">{t("merchant.badge")}</span>
          </span>
        )}
      </button>

      <div className="flex items-center gap-2.5 shrink-0">
        <LangSwitcher />

        <button
          type="button"
          aria-label={t("aria.profile")}
          aria-current={isOnProfile ? "page" : undefined}
          onClick={() => {
            if (isOnProfile) return;

            haptic.light();
            navigateTo(ROUTE_PATTERNS.PROFILE);
          }}
          className="w-8 h-8 rounded-full bg-(--color-card) border border-(--color-line) flex items-center justify-center shrink-0 cursor-pointer"
        >
          <User size={19} color="var(--color-primary)" />
        </button>
      </div>
    </header>
  );
};
