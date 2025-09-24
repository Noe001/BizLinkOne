import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { translations, type SupportedLanguage } from "@/locales";

export type TranslationParams = Record<string, string | number>;

interface LanguageContextValue {
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  t: (key: string, params?: TranslationParams) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = "bizlinkone.language";
const DEFAULT_LANGUAGE: SupportedLanguage = "en";

const getNestedValue = (object: unknown, key: string): unknown => {
  return key.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object" && part in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, object);
};

const formatValue = (value: string, params?: TranslationParams) => {
  if (!params) {
    return value;
  }

  return value.replace(/\{\{(.*?)\}\}/g, (_, token) => {
    const key = token.trim();
    const replacement = params[key];
    return replacement !== undefined ? String(replacement) : `{{${key}}}`;
  });
};

const detectBrowserLanguage = (): SupportedLanguage => {
  if (typeof navigator !== "undefined" && navigator.language) {
    const language = navigator.language.toLowerCase();
    if (language.startsWith("ja")) {
      return "ja";
    }
  }
  return DEFAULT_LANGUAGE;
};

const isSupportedLanguage = (value: string | null): value is SupportedLanguage => {
  if (!value) {
    return false;
  }
  return (Object.keys(translations) as SupportedLanguage[]).includes(value as SupportedLanguage);
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    if (typeof window === "undefined") {
      return DEFAULT_LANGUAGE;
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isSupportedLanguage(stored)) {
      return stored;
    }

    return detectBrowserLanguage();
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isSupportedLanguage(stored) && stored !== language) {
      setLanguageState(stored);
    }
  }, []);

  const setLanguage = useCallback((nextLanguage: SupportedLanguage) => {
    setLanguageState(nextLanguage);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, nextLanguage);
    }
    // TODO: Persist preferred language to the server once the profile API is ready.
  }, []);

  const translate = useCallback(
    (key: string, params?: TranslationParams) => {
      const current = getNestedValue(translations[language], key);
      const fallback = getNestedValue(translations[DEFAULT_LANGUAGE], key);

      const value = typeof current === "string" ? current : typeof fallback === "string" ? fallback : key;
      return formatValue(value, params);
    },
    [language]
  );

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
    }
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    t: translate,
  }), [language, setLanguage, translate]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

export const useTranslation = useLanguage;
