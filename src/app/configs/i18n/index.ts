import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { retrieveLaunchParams } from "@tma.js/sdk-react";

import {
  DEFAULT_LANGUAGE,
  I18N_STORAGE_KEY,
  SUPPORTED_LANGUAGES,
} from "@shared/constants";
import enCommon from "@shared/locales/en/common.json";
import kgCommon from "@shared/locales/kg/common.json";
import ruCommon from "@shared/locales/ru/common.json";

import LanguageDetector from "i18next-browser-languagedetector";

const TMA_LANG_MAP: Record<string, string> = { ky: "kg" };

const tmaLanguageDetector = {
  name: "tmaLanguage",
  lookup: (): string | undefined => {
    try {
      const params = retrieveLaunchParams();
      const code = params.tgWebAppData?.user?.language_code;

      if (!code) {
        return undefined;
      }

      return TMA_LANG_MAP[code] ?? code;
    } catch {
      return undefined;
    }
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
