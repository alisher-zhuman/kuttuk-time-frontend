import { DEFAULT_LANGUAGE, type Language, SUPPORTED_LANGUAGES } from "@shared/constants";

// i18n.language as one of ours — the detector can report anything (a browser
// "en-US", a stale stored value), and multilingual fields only have ru/kg/en.
export const resolveLang = (language: string): Language =>
  SUPPORTED_LANGUAGES.find((supported) => supported === language) ?? DEFAULT_LANGUAGE;
