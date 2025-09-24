import { en } from "./en";
import { ja } from "./ja";

export const translations = {
  en,
  ja,
} as const;

export type SupportedLanguage = keyof typeof translations;

export type Translation = (typeof translations)[SupportedLanguage];
