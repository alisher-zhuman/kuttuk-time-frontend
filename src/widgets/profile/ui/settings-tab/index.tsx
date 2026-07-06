import { useAuthStore, useViewModeStore } from "@shared/store";

import { AdminModeSection } from "../admin-mode-section";
import { LanguageSection } from "../language-section";
import { SupportSection } from "../support-section";
import { ThemeSection } from "../theme-section";

export const SettingsTab = () => {
  const role = useAuthStore((s) => s.role);
  const viewMode = useViewModeStore((s) => s.viewMode);

  return (
    <div className="flex flex-col gap-4">
      <LanguageSection />
      <ThemeSection />

      {viewMode !== "admin" && <SupportSection />}
      {role === "admin" && <AdminModeSection />}
    </div>
  );
};
