import { useTranslation } from "react-i18next";

import { Send } from "lucide-react";

import { TelegramSignOut } from "@features/telegram-login";

import { BOT_URL } from "@shared/constants";
import { goToUrl } from "@shared/helpers";
import { useAppModeStore, useAuthStore, useViewModeStore } from "@shared/store";
import { RowButton } from "@shared/ui";

import { HomeScreenSection } from "../home-screen-section";
import { LanguageSection } from "../language-section";
import { NotificationsSection } from "../notifications-section";
import { RoleModeSection } from "../role-mode-section";
import { SupportSection } from "../support-section";
import { ThemeSection } from "../theme-section";

export const SettingsTab = () => {
  const { t } = useTranslation();

  const role = useAuthStore((s) => s.role);
  const viewMode = useViewModeStore((s) => s.viewMode);
  const isWeb = useAppModeStore((s) => s.mode === "web");

  const isStaff = role === "admin" || role === "merchant";

  return (
    <div className="flex flex-col gap-4">
      {/* The website, signed in with Telegram: «Выйти». */}
      <TelegramSignOut />
      <LanguageSection />
      <ThemeSection />

      {/* The website: the cabinet, sale notices and the home screen icon are
          the Mini App's - only a way there. */}
      {isWeb && isStaff && (
        <RowButton
          icon={<Send size={20} />}
          label={t("site.telegramOnly.title")}
          onClick={() => goToUrl(`${BOT_URL}/app`)}
        />
      )}

      {!isWeb && isStaff && <RoleModeSection role={role} />}
      {/* By role, not view mode: sale notices belong to the account. */}
      {!isWeb && role === "merchant" && <NotificationsSection />}
      {!isWeb && role === "merchant" && <HomeScreenSection />}
      {/* Buyers (incl. an admin previewing as one) and owners - owners ask the
          most, about payouts and redemption. Not the admin's own mode. */}
      {(viewMode === "user" || role === "merchant") && <SupportSection />}
    </div>
  );
};
