import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import {
  DEFAULT_LANGUAGE,
  I18N_STORAGE_KEY,
  SUPPORTED_LANGUAGES,
} from "@shared/constants";
import { getLaunchParams } from "@shared/helpers";
import { enCommon, kgCommon, ruCommon } from "@shared/locales";

import LanguageDetector from "i18next-browser-languagedetector";

const TMA_LANG_MAP: Record<string, string> = { ky: "kg" };

const tmaLanguageDetector = {
  name: "tmaLanguage",
  lookup: (): string | undefined => {
    const code = getLaunchParams()?.tgWebAppData?.user?.language_code;
    if (!code) return undefined;
    return TMA_LANG_MAP[code] ?? code;
  },
};

const detector = new LanguageDetector();
detector.addDetector(tmaLanguageDetector);

void i18n
  .use(detector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: enCommon },
      kg: { common: kgCommon },
      ru: { common: ruCommon },
    },
    supportedLngs: [...SUPPORTED_LANGUAGES],
    fallbackLng: DEFAULT_LANGUAGE,
    defaultNS: "common",
    detection: {
      order: ["localStorage", "tmaLanguage", "navigator"],
      lookupLocalStorage: I18N_STORAGE_KEY,
      caches: ["localStorage"],
    },
    interpolation: { escapeValue: false },
    returnNull: false,
  });
