import { useNavigate } from "react-router";

import { useTranslation } from "react-i18next";

import { User } from "lucide-react";

import { ROUTES } from "@shared/constants";
import { Logo } from "@shared/ui";

import { LangSwitcher } from "../lang-switcher";

export const Header = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  return (
    <header className="px-4 h-12 flex items-center gap-2.5">
      <div className="flex items-center flex-1 min-w-0 leading-none">
        <Logo />
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <LangSwitcher />

        <button
          type="button"
          aria-label={t("aria.profile")}
          onClick={() => void navigate(ROUTES.PROFILE)}
          className="w-8 h-8 rounded-full bg-(--color-card) border border-(--color-line) flex items-center justify-center shrink-0 cursor-pointer"
        >
          <User size={19} color="var(--color-primary)" />
        </button>
      </div>
    </header>
  );
};
