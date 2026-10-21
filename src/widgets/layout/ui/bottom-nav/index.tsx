import { useLocation } from "react-router";

import { useTranslation } from "react-i18next";

import { cn } from "@shared/helpers";
import { useHaptic, useNavigateTo } from "@shared/hooks";

import type { NavTab } from "../../constants";

interface Props {
  tabs: readonly NavTab[];
}

export const BottomNav = ({ tabs }: Props) => {
  const { t } = useTranslation();

  const navigateTo = useNavigateTo();

  const haptic = useHaptic();

  const { pathname } = useLocation();

  const activeIndex = tabs.findIndex((tab) => tab.path === pathname);

  return (
    <div
      className="relative mx-4 mb-4 flex gap-1 rounded-3xl bg-(--color-card) p-1.5"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div
        className="absolute top-1.5 bottom-1.5 left-1.5 rounded-2xl bg-(--color-primary) transition-transform duration-200 ease-out"
        style={{
          width: `calc((100% - ${12 + 4 * (tabs.length - 1)}px) / ${tabs.length})`,
          transform: `translateX(calc(${activeIndex} * (100% + 4px)))`
        }}
      />

      {tabs.map(({ path, labelKey, icon: Icon }) => {
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
              "relative z-10 flex flex-1 min-w-0 flex-col items-center gap-0.5 py-2 rounded-2xl cursor-pointer transition-colors duration-150",
              isActive ? "text-(--color-card)" : "text-(--color-hint)"
            )}
          >
            <Icon size={17} strokeWidth={isActive ? 2.2 : 1.8} />
            <span className="max-w-full truncate text-xs font-semibold tracking-tight">{t(labelKey)}</span>
          </button>
        );
      })}
    </div>
  );
};
