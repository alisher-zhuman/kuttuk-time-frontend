import { useState } from "react";

import { useTranslation } from "react-i18next";

import { getTMAUserInfo } from "@shared/helpers";

const user = getTMAUserInfo();

type Tab = "certificates" | "settings";

const TABS: Tab[] = ["certificates", "settings"];

export const ProfilePage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<Tab>("certificates");
  const [contentAnimation, setContentAnimation] = useState("animate-tab-enter-right");

  const handleTabChange = (tab: Tab) => {
    if (tab === activeTab) return;
    setContentAnimation(
      TABS.indexOf(tab) > TABS.indexOf(activeTab)
        ? "animate-tab-enter-right"
        : "animate-tab-enter-left",
    );
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="flex items-center gap-4">
        {user?.photoUrl ? (
          <img
            src={user.photoUrl}
            alt={user.fullName}
            className="w-16 h-16 rounded-full object-cover shrink-0"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-(--color-card) shrink-0" />
        )}

        <div className="flex flex-col gap-1 min-w-0">
          {user?.fullName && (
            <span className="text-lg font-bold text-(--color-ink) truncate">
              {user.fullName}
            </span>
          )}

          {user?.username && (
            <span className="text-sm text-(--color-slate)">
              @{user.username}
            </span>
          )}
        </div>
      </div>

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
            onClick={() => handleTabChange(tab)}
            className={`relative z-10 flex-1 py-2 rounded-lg text-sm font-bold transition-colors duration-200 ${
              activeTab === tab ? "text-(--color-ink)" : "text-(--color-slate)"
            }`}
          >
            {t(`profile.tabs.${tab}`)}
          </button>
        ))}
      </div>

      <div key={activeTab} className={contentAnimation}>
        {activeTab === "certificates" && <div />}
        {activeTab === "settings" && <div />}
      </div>
    </div>
  );
};
