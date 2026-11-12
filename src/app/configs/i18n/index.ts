import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import {
  DEFAULT_LANGUAGE,
  I18N_STORAGE_KEY,
  SITE_DEFAULT_LANGUAGE,
  SITE_LANG_PARAM,
  SUPPORTED_LANGUAGES
} from "@shared/constants";
import { getLaunchParams, getScopedStorageKey } from "@shared/helpers";
import { enCommon, kgCommon, ruCommon } from "@shared/locales";
import { isWebsite } from "@shared/store";

import LanguageDetector from "i18next-browser-languagedetector";

const TMA_LANG_MAP: Record<string, string> = { ky: "kg" };

const tmaLanguageDetector = {
  name: "tmaLanguage",
  lookup: (): string | undefined => {
    const code = getLaunchParams()?.tgWebAppData?.user?.language_code;

    if (!code) return undefined;

    return TMA_LANG_MAP[code] ?? code;
  }
};

// The website: the address says the language - ?lang=kg / ?lang=en, none is
// Russian. Each version is its own indexed page, so a stored choice or the
// browser's language must not show another one under it.
const siteLanguageDetector = {
  name: "siteLanguage",
  lookup: (): string => {
    const lang = new URLSearchParams(window.location.search).get(SITE_LANG_PARAM);

    return lang && (SUPPORTED_LANGUAGES as readonly string[]).includes(lang) ? lang : SITE_DEFAULT_LANGUAGE;
  }
};

const detector = new LanguageDetector();

detector.addDetector(tmaLanguageDetector);
detector.addDetector(siteLanguageDetector);

void i18n
  .use(detector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: enCommon },
      kg: { common: kgCommon },
      ru: { common: ruCommon }
    },
    supportedLngs: [...SUPPORTED_LANGUAGES],
    fallbackLng: DEFAULT_LANGUAGE,
    defaultNS: "common",
    // isWebsite() is already known: TMAProvider's module (imported before
    // this one in app/index.tsx) sets the mode.
    detection: isWebsite()
      ? { order: ["siteLanguage"], caches: [] }
      : {
          order: ["localStorage", "tmaLanguage", "navigator"],
          lookupLocalStorage: getScopedStorageKey(I18N_STORAGE_KEY),
          caches: ["localStorage"]
        },
    interpolation: { escapeValue: false },
    returnNull: false
  });

export default i18n;
