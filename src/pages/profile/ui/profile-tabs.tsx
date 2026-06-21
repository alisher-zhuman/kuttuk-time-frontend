import { useTranslation } from "react-i18next";

import { type Tab,TABS } from "./tabs-model";

interface Props {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export const ProfileTabs = ({ activeTab, onTabChange }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="relative flex w-full rounded-xl bg-(--color-surface) p-1 gap-1">
      <div
        className="absolute top-1 bottom-1 rounded-lg bg-(--color-card) shadow-sm transition-transform duration-200 ease-out"
        style={{
          left: 4,
          width: "calc(50% - 6px)",
          transform:
            activeTab === "settings"
              ? "translateX(calc(100% + 4px))"
              : "translateX(0)",
        }}
      />

      {TABS.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onTabChange(tab)}
          className={`relative z-10 flex-1 py-2 rounded-lg text-sm font-bold transition-colors duration-200 ${
            activeTab === tab ? "text-(--color-ink)" : "text-(--color-slate)"
          }`}
        >
          {t(`profile.tabs.${tab}`)}
        </button>
      ))}
    </div>
  );
};
