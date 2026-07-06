import { useTranslation } from "react-i18next";

import { Shield, User } from "lucide-react";

import { ROUTE_PATTERNS } from "@shared/constants";
import { useHaptic, useNavigateTo } from "@shared/hooks";
import { useViewModeStore } from "@shared/store";
import { LangSwitcher, Logo } from "@shared/ui";

export const Header = () => {
  const { t } = useTranslation();

  const navigateTo = useNavigateTo();

  const haptic = useHaptic();

  const viewMode = useViewModeStore((s) => s.viewMode);

  return (
    <header className="px-4 h-12 flex items-center justify-between gap-2.5">
      <button
        type="button"
        onClick={() => {
          haptic.light();
          navigateTo(viewMode === "admin" ? ROUTE_PATTERNS.ADMIN_MERCHANTS : ROUTE_PATTERNS.HOME);
        }}
        className="flex items-center gap-2 leading-none cursor-pointer min-w-0"
      >
        <Logo />

        {viewMode === "admin" && (
          <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-(--color-primary) text-(--color-card) text-xs font-bold shrink-0">
            <Shield size={12} />
            {t("admin.badge")}
          </span>
        )}
      </button>

      <div className="flex items-center gap-2.5 shrink-0">
        <LangSwitcher />

        <button
          type="button"
          aria-label={t("aria.profile")}
          onClick={() => {
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
