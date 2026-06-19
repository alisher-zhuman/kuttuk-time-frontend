import { useTranslation } from "react-i18next";

import { LANGUAGE_BADGE, SUPPORTED_LANGUAGES } from "@shared/constants";

export const LangSwitcher = () => {
  const { t, i18n } = useTranslation();

  const lang = i18n.language as keyof typeof LANGUAGE_BADGE;
  const badge = LANGUAGE_BADGE[lang] ?? LANGUAGE_BADGE.ru;

  const cycleLanguage = () => {
    const idx = SUPPORTED_LANGUAGES.indexOf(lang);
    const next = SUPPORTED_LANGUAGES[(idx + 1) % SUPPORTED_LANGUAGES.length];
    void i18n.changeLanguage(next);
  };

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
