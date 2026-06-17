import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { DEFAULT_LANGUAGE, I18N_STORAGE_KEY, SUPPORTED_LANGUAGES } from "@shared/constants/i18n";
import kgCommonTranslations from "@shared/locales/kg/common.json";
import ruCommonTranslations from "@shared/locales/ru/common.json";

import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  kg: { common: kgCommonTranslations },
  ru: { common: ruCommonTranslations },
} as const;

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    supportedLngs: [...SUPPORTED_LANGUAGES],
    fallbackLng: DEFAULT_LANGUAGE,
    defaultNS: "common",
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: I18N_STORAGE_KEY,
      caches: ["localStorage"],
    },
    interpolation: { escapeValue: false },
    returnNull: false,
  });
