import enCommon from "./en/common.json";
import heCommon from "./he/common.json";

export const resources = {
  en: {
    common: enCommon,
  },
  he: {
    common: heCommon,
  },
} as const;

export const defaultLanguage = "en";
export const supportedLanguages = ["en", "he"] as const;

export type SupportedLanguage = (typeof supportedLanguages)[number];
