import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { resources, defaultLanguage } from "../locales";

// Chrome extension storage utilities for language persistence
const getStoredLanguage = async (): Promise<string> => {
  try {
    const result = await chrome.storage.local.get(["language"]);
    return result.language || defaultLanguage;
  } catch (error) {
    console.warn("Failed to get stored language, using default:", error);
    return defaultLanguage;
  }
};

const setStoredLanguage = async (language: string): Promise<void> => {
  try {
    await chrome.storage.local.set({ language });
  } catch (error) {
    console.warn("Failed to store language:", error);
  }
};

// Initialize i18next
i18n.use(initReactI18next).init({
  resources,
  lng: defaultLanguage, // Will be updated after loading from storage
  fallbackLng: defaultLanguage,
  defaultNS: "common",
  ns: ["common"],

  interpolation: {
    escapeValue: false, // React already escapes values
  },

  // Enable plural forms
  pluralSeparator: "_",
  contextSeparator: "_",

  // Development settings
  debug: process.env.NODE_ENV === "development",

  // React-specific settings
  react: {
    useSuspense: false, // Disable suspense for Chrome extension compatibility
  },
});

// Load stored language on initialization
getStoredLanguage().then((storedLanguage) => {
  if (storedLanguage !== i18n.language) {
    i18n.changeLanguage(storedLanguage);
  }
});

// Save language changes to storage
i18n.on("languageChanged", (lng) => {
  setStoredLanguage(lng);

  // Update document direction for RTL languages
  const isRTL = lng === "he";
  document.documentElement.dir = isRTL ? "rtl" : "ltr";
  document.documentElement.lang = lng;
});

export { getStoredLanguage, setStoredLanguage };
export default i18n;
