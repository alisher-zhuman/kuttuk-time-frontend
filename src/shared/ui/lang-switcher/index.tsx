import { useTranslation } from "react-i18next";

import { LANGUAGE_BADGE, SUPPORTED_LANGUAGES } from "@shared/constants";

import { SegmentedControl } from "../segmented-control";

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
    const items = SUPPORTED_LANGUAGES.map((l) => {
      const b = LANGUAGE_BADGE[l];
      
      return {
        value: l,
        label: (
          <span className="flex items-center gap-1.5">
            <span className="text-base leading-none">{b.flag}</span>
            <span>{b.code}</span>
          </span>
        ),
      };
    });

    return (
      <SegmentedControl
        items={items}
        value={lang}
        onChange={(l) => void i18n.changeLanguage(l)}
      />
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
