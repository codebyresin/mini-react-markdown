import { create } from "zustand";
import { en } from "./en";
import { cn } from "./cn";
import { tw } from "./tw";
import { defaultGlobalConfig } from "@/config/global";

type Language = "en" | "cn" | "tw";
const locales = { en, cn, tw } as const;
export type TRANSLATION_KEYS = keyof typeof en;

interface TranslationStoreType {
  currentLocale: Language;
  t: (key: TRANSLATION_KEYS) => string;
  setLocale: (locale: Language) => void;
}

const DEFAULT_LOCALE: Language = defaultGlobalConfig.locale as Language;

//翻译store
export const useTranslation = create<TranslationStoreType>((set, get) => ({
  currentLocale: DEFAULT_LOCALE,
  t: (key: TRANSLATION_KEYS) => {
    const currentLocale = get().currentLocale;
    const currentTranslations = locales[currentLocale];
    return currentTranslations[key] || locales.en[key];
  },
  setLocale: (locale: Language) => set({ currentLocale: locale }),
}));

//导出函数，后面无需钩子获取
export const t = (key: TRANSLATION_KEYS): string => {
  return useTranslation.getState().t(key);
};

// 设置语言函数
export const setLocale = (locale: Language): void => {
  if (locale) {
    useTranslation.getState().setLocale(locale);
  }
  useTranslation.getState().setLocale(locale);
};

// 获取当前语言
export const getCurrentLocale = (): Language => {
  return useTranslation.getState().currentLocale;
};
