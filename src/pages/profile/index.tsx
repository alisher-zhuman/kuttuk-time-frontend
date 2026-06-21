import { useState } from "react";

import { useTranslation } from "react-i18next";

import { getTMAUserInfo } from "@shared/helpers";

const user = getTMAUserInfo();

type Tab = "certificates" | "settings";

export const ProfilePage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<Tab>("certificates");

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

      <div className="flex w-full rounded-xl bg-(--color-surface) p-1 gap-1">
        {(["certificates", "settings"] as Tab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors duration-150 ${
              activeTab === tab
                ? "bg-(--color-card) text-(--color-ink) shadow-sm"
                : "text-(--color-slate)"
            }`}
          >
            {t(`profile.tabs.${tab}`)}
          </button>
        ))}
      </div>

      {activeTab === "certificates" && (
        <div />
      )}

      {activeTab === "settings" && (
        <div />
      )}
    </div>
  );
};
