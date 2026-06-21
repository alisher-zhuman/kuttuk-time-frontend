import { useState } from "react";
import { useSearchParams } from "react-router";

import {
  CertificatesTab,
  PROFILE_TABS,
  ProfileInfo,
  ProfileTabs,
  SettingsTab,
  type Tab,
} from "@widgets/profile";

import { getTMAUserInfo } from "@shared/helpers";

const user = getTMAUserInfo();

const isValidTab = (value: string | null): value is Tab =>
  PROFILE_TABS.includes(value as Tab);

export const ProfilePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = searchParams.get("tab");
  const activeTab: Tab = isValidTab(tabParam) ? tabParam : "certificates";

  const [contentAnimation, setContentAnimation] = useState(
    "animate-tab-enter-right",
  );

  const handleTabChange = (tab: Tab) => {
    if (tab === activeTab) return;
    setContentAnimation(
      PROFILE_TABS.indexOf(tab) > PROFILE_TABS.indexOf(activeTab)
        ? "animate-tab-enter-right"
        : "animate-tab-enter-left",
    );
    setSearchParams({ tab });
  };

  return (
    <div className="flex flex-col gap-4 py-4">
      <ProfileInfo user={user} />

      <ProfileTabs activeTab={activeTab} onTabChange={handleTabChange} />

      <div key={activeTab} className={contentAnimation}>
        {activeTab === "certificates" && <CertificatesTab />}
        {activeTab === "settings" && <SettingsTab />}
      </div>
    </div>
  );
};
