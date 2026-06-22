import { useTranslation } from "react-i18next";

import { User } from "lucide-react";

import { ROUTES } from "@shared/constants";
import { useHaptic, useNavigateTo } from "@shared/hooks";
import { LangSwitcher, Logo } from "@shared/ui";

export const Header = () => {
  const { t } = useTranslation();

  const navigateTo = useNavigateTo();
  const haptic = useHaptic();

  return (
    <header className="px-4 h-12 flex items-center justify-between gap-2.5">
      <button
        type="button"
        onClick={() => { haptic.light(); navigateTo(ROUTES.HOME); }}
        className="flex items-center leading-none cursor-pointer"
      >
        <Logo />
      </button>

      <div className="flex items-center gap-2.5 shrink-0">
        <LangSwitcher />

        <button
          type="button"
          aria-label={t("aria.profile")}
          onClick={() => { haptic.light(); navigateTo(ROUTES.PROFILE); }}
          className="w-8 h-8 rounded-full bg-(--color-card) border border-(--color-line) flex items-center justify-center shrink-0 cursor-pointer"
        >
          <User size={19} color="var(--color-primary)" />
        </button>
      </div>
    </header>
  );
};
