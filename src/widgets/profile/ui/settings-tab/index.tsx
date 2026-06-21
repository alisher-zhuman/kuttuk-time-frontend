import { useTranslation } from "react-i18next";

import { Check } from "lucide-react";

import { LANGUAGE_BADGE, SUPPORTED_LANGUAGES } from "@shared/constants";
import { cn } from "@shared/helpers";

type Lang = (typeof SUPPORTED_LANGUAGES)[number];

const LANGUAGE_NAMES: Record<Lang, string> = {
  kg: "Кыргызча",
  ru: "Русский",
  en: "English",
};

export const SettingsTab = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language as Lang;

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold text-(--color-slate) uppercase tracking-wider px-1">
        {t("language.label")}
      </span>

      <div className="rounded-xl bg-(--color-card) overflow-hidden">
        {SUPPORTED_LANGUAGES.map((lang, idx) => {
          const badge = LANGUAGE_BADGE[lang];
          const isActive = currentLang === lang;

          return (
            <button
              key={lang}
              type="button"
              onClick={() => void i18n.changeLanguage(lang)}
              className={cn(
                "flex items-center gap-3 w-full px-4 py-3.5 cursor-pointer",
                idx < SUPPORTED_LANGUAGES.length - 1 &&
                  "border-b border-(--color-line)",
              )}
            >
              <span className="text-xl leading-none">{badge.flag}</span>
              <span
                className={cn(
                  "flex-1 text-left text-sm font-medium",
                  isActive ? "text-(--color-ink)" : "text-(--color-slate)",
                )}
              >
                {LANGUAGE_NAMES[lang]}
              </span>
              {isActive && (
                <div className="w-5 h-5 rounded-full bg-(--color-primary) flex items-center justify-center shrink-0">
                  <Check size={12} color="white" strokeWidth={3} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
