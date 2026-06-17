import { useTranslation } from "react-i18next";

import { Globe, User } from "lucide-react";

import { LANGUAGE_BADGE } from "@shared/constants";

export const Header = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as keyof typeof LANGUAGE_BADGE;
  const badge = LANGUAGE_BADGE[lang] ?? LANGUAGE_BADGE.ru;

  return (
    <header className="h-12 bg-(--color-header) border-b border-(--color-line) flex items-center gap-2.5">
        <div className="flex items-center flex-1 min-w-0 leading-none">
          <span className="text-lg font-extrabold text-(--color-ink) tracking-tight whitespace-nowrap">
            Kuttuk<span className="text-(--color-primary)">Time</span>
          </span>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            aria-label={t("aria.changeLanguage")}
            className="flex items-center gap-1.5 h-7.5 px-3 rounded-full bg-(--color-surface) text-(--color-ink) shrink-0"
          >
            <Globe size={15} color="var(--color-primary)" />
            <span className="text-sm font-extrabold tracking-wide">
              {badge.code}
            </span>
          </button>

          <button
            type="button"
            aria-label={t("aria.profile")}
            className="w-8 h-8 rounded-full bg-(--color-surface) flex items-center justify-center shrink-0"
          >
            <User size={19} color="var(--color-primary)" />
          </button>
        </div>
    </header>
  );
};
