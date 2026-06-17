import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { DEFAULT_LANGUAGE, I18N_STORAGE_KEY, SUPPORTED_LANGUAGES } from "@shared/constants";
import enCommon from "@shared/locales/en/common.json";
import kgCommon from "@shared/locales/kg/common.json";
import ruCommon from "@shared/locales/ru/common.json";

import LanguageDetector from "i18next-browser-languagedetector";

void i18n
  .use(LanguageDetector)
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
      order: ["localStorage", "navigator"],
      lookupLocalStorage: I18N_STORAGE_KEY,
      caches: ["localStorage"],
    },
    interpolation: { escapeValue: false },
    returnNull: false,
  });
