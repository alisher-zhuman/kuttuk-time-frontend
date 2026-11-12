import { useLocation } from "react-router";

import { useTranslation } from "react-i18next";

import { LANGUAGE_BADGE, SUPPORTED_LANGUAGES } from "@shared/constants";
import { resolveLang } from "@shared/helpers";
import { useHaptic, useNavigateTo } from "@shared/hooks";
import { isWebsite } from "@shared/store";

import { SegmentedControl } from "../segmented-control";

interface Props {
  variant?: "compact" | "segmented";
}

export const LangSwitcher = ({ variant = "compact" }: Props) => {
  const { t, i18n } = useTranslation();
  
  const haptic = useHaptic();

  const navigateTo = useNavigateTo();

  const { pathname, search } = useLocation();

  const lang = resolveLang(i18n.language);
  const badge = LANGUAGE_BADGE[lang];

  // The website: the language is in the address (?lang) - the same page in
  // the new language, without a new history entry.
  const changeLanguage = (next: string) =>
    void i18n.changeLanguage(next).then(() => {
      if (isWebsite()) navigateTo(pathname + search, { replace: true });
    });

  const cycleLanguage = () => {
    haptic.light();
    const idx = SUPPORTED_LANGUAGES.indexOf(lang);
    const next = SUPPORTED_LANGUAGES[(idx + 1) % SUPPORTED_LANGUAGES.length]!;
    changeLanguage(next);
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
        )
      };
    });

    return (
      <SegmentedControl
        items={items}
        value={lang}
        onChange={changeLanguage}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={cycleLanguage}
      // Starts with the visible code, so voice control ("tap РУ") finds it.
      aria-label={`${badge.code}, ${t("aria.changeLanguage")}`}
      className="flex items-center gap-1.5 h-7.5 px-3 rounded-full bg-(--color-card) border border-(--color-line) text-(--color-ink) shrink-0 cursor-pointer"
    >
      <span key={lang} className="flex items-center gap-1.5 animate-lang-flip">
        <span aria-hidden="true" className="text-base leading-none">
          {badge.flag}
        </span>
        <span className="text-sm font-extrabold tracking-wide">{badge.code}</span>
      </span>
    </button>
  );
};
