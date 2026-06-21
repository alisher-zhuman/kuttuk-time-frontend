import { useTranslation } from "react-i18next";

import { LANGUAGE_BADGE, SUPPORTED_LANGUAGES } from "@shared/constants";
import { cn } from "@shared/helpers";

type Lang = keyof typeof LANGUAGE_BADGE;

interface Props {
  variant?: "compact" | "segmented";
}

export const LangSwitcher = ({ variant = "compact" }: Props) => {
  const { t, i18n } = useTranslation();

  const lang = i18n.language as Lang;
  const badge = LANGUAGE_BADGE[lang] ?? LANGUAGE_BADGE.ru;

  const cycleLanguage = () => {
    const idx = SUPPORTED_LANGUAGES.indexOf(lang);
    const next = SUPPORTED_LANGUAGES[(idx + 1) % SUPPORTED_LANGUAGES.length];
    void i18n.changeLanguage(next);
  };

  if (variant === "segmented") {
    return (
      <div className="flex rounded-xl bg-(--color-surface) p-1 gap-1">
        {SUPPORTED_LANGUAGES.map((l) => {
          const b = LANGUAGE_BADGE[l];
          const isActive = lang === l;

          return (
            <button
              key={l}
              type="button"
              onClick={() => void i18n.changeLanguage(l)}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-bold transition-colors cursor-pointer",
                isActive ? "bg-(--color-card) text-(--color-ink)" : "text-(--color-slate)",
              )}
            >
              <span className="text-base leading-none">{b.flag}</span>
              <span>{b.code}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={cycleLanguage}
      aria-label={t("aria.changeLanguage")}
      className="flex items-center gap-1.5 h-7.5 px-3 rounded-full bg-(--color-card) border border-(--color-line) text-(--color-ink) shrink-0 cursor-pointer"
    >
      <span key={lang} className="flex items-center gap-1.5 animate-lang-flip">
        <span className="text-base leading-none">{badge.flag}</span>
        <span className="text-sm font-extrabold tracking-wide">{badge.code}</span>
      </span>
    </button>
  );
};
