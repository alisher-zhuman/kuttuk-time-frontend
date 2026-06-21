import {
  CertificatesTab,
  ProfileInfo,
  ProfileTabs,
  SettingsTab,
  useProfileTab,
} from "@widgets/profile";

import { getTMAUserInfo } from "@shared/helpers";

const user = getTMAUserInfo();

export const ProfilePage = () => {
  const { activeTab, contentAnimation, handleTabChange } = useProfileTab();

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
