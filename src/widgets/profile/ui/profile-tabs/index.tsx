import { useTranslation } from "react-i18next";

import { cn } from "@shared/helpers";

import { type Tab,TABS } from "../../model";

interface Props {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export const ProfileTabs = ({ activeTab, onTabChange }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="relative flex w-full rounded-xl bg-(--color-surface) p-1 gap-1">
      <div
        className={cn(
          "absolute top-1 bottom-1 left-1 w-[calc(50%-6px)] rounded-lg bg-(--color-card) shadow-sm transition-transform duration-200 ease-out",
          activeTab === "settings"
            ? "translate-x-[calc(100%+4px)]"
            : "translate-x-0",
        )}
      />

      {TABS.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onTabChange(tab)}
          className={cn(
            "relative z-10 flex-1 py-2 rounded-lg text-sm font-bold transition-colors duration-200 cursor-pointer",
            activeTab === tab ? "text-(--color-ink)" : "text-(--color-slate)",
          )}
        >
          {t(`profile.tabs.${tab}`)}
        </button>
      ))}
    </div>
  );
};
