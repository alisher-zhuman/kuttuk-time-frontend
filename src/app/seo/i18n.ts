import i18next, { type TFunction } from "i18next";

import { enCommon, kgCommon, ruCommon } from "@shared/locales";

import type { SeoLanguage } from "./site";

// The app's texts, one instance per language - the build renders all three.
export const createSeoT = (lang: SeoLanguage): TFunction => {
  const instance = i18next.createInstance();

  void instance.init({
    resources: { ru: { common: ruCommon }, kg: { common: kgCommon }, en: { common: enCommon } },
    lng: lang,
    fallbackLng: "ru",
    defaultNS: "common",
    interpolation: { escapeValue: false },
    initAsync: false
  });

  return instance.t;
};
