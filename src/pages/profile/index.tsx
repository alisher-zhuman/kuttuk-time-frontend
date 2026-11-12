import {
  CertificatesTab,
  ProfileInfo,
  ProfileTabs,
  SettingsTab,
  useProfileTab
} from "@widgets/profile";

import { TelegramSignOut } from "@features/telegram-login";

import { getWebsiteUser } from "@shared/api";
import { getTMAUserInfo } from "@shared/helpers";
import { useAppModeStore, useAuthStore } from "@shared/store";

const tmaUser = getTMAUserInfo();

export const ProfilePage = () => {
  const { activeTab, contentAnimation, handleTabChange } = useProfileTab();

  const isWeb = useAppModeStore((s) => s.mode === "web");
  const isGuest = useAuthStore((s) => s.isGuest);

  // The website: whoever signed in with Telegram; a guest has no one.
  const user = isWeb ? (isGuest ? null : getWebsiteUser()) : tmaUser;

  return (
    <div className="flex-1 flex flex-col gap-4 pt-2 pb-4">
      <ProfileInfo user={user} action={<TelegramSignOut />} />

      <ProfileTabs activeTab={activeTab} onTabChange={handleTabChange} />

      <div key={activeTab} className={contentAnimation}>
        {activeTab === "certificates" && <CertificatesTab />}
        {activeTab === "settings" && <SettingsTab />}
      </div>
    </div>
  );
};
