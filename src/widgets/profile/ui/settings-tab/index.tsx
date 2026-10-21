import { useAuthStore, useViewModeStore } from "@shared/store";

import { LanguageSection } from "../language-section";
import { NotificationsSection } from "../notifications-section";
import { RoleModeSection } from "../role-mode-section";
import { SupportSection } from "../support-section";
import { ThemeSection } from "../theme-section";

export const SettingsTab = () => {
  const role = useAuthStore((s) => s.role);
  const viewMode = useViewModeStore((s) => s.viewMode);

  return (
    <div className="flex flex-col gap-4">
      <LanguageSection />
      <ThemeSection />

      {(role === "admin" || role === "merchant") && (
        <RoleModeSection role={role} />
      )}
      {/* By role, not view mode: sale notices belong to the account. */}
      {role === "merchant" && <NotificationsSection />}
      {viewMode === "user" && <SupportSection />}
    </div>
  );
};
