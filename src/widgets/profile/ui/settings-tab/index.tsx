import { useAuthStore, useViewModeStore } from "@shared/store";

import { LanguageSection } from "../language-section";
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
      {viewMode === "user" && <SupportSection />}
    </div>
  );
};
