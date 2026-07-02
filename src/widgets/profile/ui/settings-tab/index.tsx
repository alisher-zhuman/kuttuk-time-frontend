import { LanguageSection } from "../language-section";
import { SupportSection } from "../support-section";
import { ThemeSection } from "../theme-section";

export const SettingsTab = () => (
  <div className="flex flex-col gap-4">
    <LanguageSection />
    <ThemeSection />
    <SupportSection />
  </div>
);
