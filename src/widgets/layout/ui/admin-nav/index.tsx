import { useLocation } from "react-router";

import { useTranslation } from "react-i18next";

import { cn } from "@shared/helpers";
import { useHaptic, useNavigateTo } from "@shared/hooks";

import { ADMIN_NAV_TABS } from "../../constants";

const N = ADMIN_NAV_TABS.length;

export const AdminNav = () => {
  const { t } = useTranslation();

  const navigateTo = useNavigateTo();

  const haptic = useHaptic();

  const { pathname } = useLocation();

  const activeIndex = ADMIN_NAV_TABS.findIndex((tab) => tab.path === pathname);

  return (
    <div
      className="relative mx-4 mb-4 flex gap-1 rounded-3xl bg-(--color-card) p-1.5"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div
        className="absolute top-1.5 bottom-1.5 left-1.5 rounded-2xl bg-(--color-primary) transition-transform duration-200 ease-out"
        style={{
          width: `calc((100% - ${12 + 4 * (N - 1)}px) / ${N})`,
          transform: `translateX(calc(${activeIndex} * (100% + 4px)))`,
        }}
      />

      {ADMIN_NAV_TABS.map(({ path, labelKey, icon: Icon }) => {
        const isActive = path === pathname;

        return (
          <button
            key={path}
            type="button"
            onClick={() => {
              haptic.selection();
              navigateTo(path, { replace: true });
            }}
            className={cn(
              "relative z-10 flex flex-1 flex-col items-center gap-0.5 py-2 rounded-2xl cursor-pointer transition-colors duration-150",
              isActive ? "text-(--color-card)" : "text-(--color-hint)",
            )}
          >
            <Icon size={17} strokeWidth={isActive ? 2.2 : 1.8} />
            <span className="text-xs font-semibold">{t(labelKey)}</span>
          </button>
        );
      })}
    </div>
  );
};
