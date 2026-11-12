import {
  CertificatesTab,
  ProfileInfo,
  ProfileTabs,
  SettingsTab,
  useProfileTab
} from "@widgets/profile";

import { TelegramSignOut } from "@features/telegram-login";

import { getWebsiteUser } from "@shared/api";
import { getHomeRoute } from "@shared/constants";
import { getTMAUserInfo } from "@shared/helpers";
import { useHaptic, useNavigateTo } from "@shared/hooks";
import { useAppModeStore, useAuthStore, useViewModeStore } from "@shared/store";
import { Logo } from "@shared/ui";

const tmaUser = getTMAUserInfo();

export const ProfilePage = () => {
  const { activeTab, contentAnimation, handleTabChange } = useProfileTab();

  const navigateTo = useNavigateTo();

  const haptic = useHaptic();

  const viewMode = useViewModeStore((s) => s.viewMode);
  const isWeb = useAppModeStore((s) => s.mode === "web");
  const isGuest = useAuthStore((s) => s.isGuest);

  // The website: whoever signed in with the widget; a guest has no one.
  const user = isWeb ? (isGuest ? null : getWebsiteUser()) : tmaUser;

  const homeRoute = getHomeRoute(viewMode);

  return (
    <div className="flex-1 flex flex-col gap-4 py-4">
      <ProfileInfo user={user} action={<TelegramSignOut />} />

      <ProfileTabs activeTab={activeTab} onTabChange={handleTabChange} />

      <div key={activeTab} className={contentAnimation}>
        {activeTab === "certificates" && <CertificatesTab />}
        {activeTab === "settings" && <SettingsTab />}
      </div>

      <div className="mt-auto flex justify-center pt-6 pb-2">
        <button
          type="button"
          onClick={() => {
            haptic.light();
            navigateTo(homeRoute);
          }}
          className="cursor-pointer"
        >
          <Logo />
        </button>
      </div>
    </div>
  );
};
