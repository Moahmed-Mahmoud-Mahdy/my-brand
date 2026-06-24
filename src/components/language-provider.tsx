"use client";

import {
  createContext,
  useContext,
  useEffect,
  type ReactNode,
} from "react";
import { useLanguageStore } from "@/lib/language-store";
import { translations, type Language } from "@/lib/i18n";

interface LanguageContextValue {
  lang: Language;
  t: (typeof translations)["ar"];
  dir: "rtl" | "ltr";
  setLang: (lang: Language) => void;
  toggle: () => void;
  ready: boolean;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { lang, setLang, toggle } = useLanguageStore();

  // Sync the document dir/lang attribute whenever language changes.
  // Runs only on client after mount — safe.
  useEffect(() => {
    const dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang]);

  const value: LanguageContextValue = {
    lang,
    t: translations[lang],
    dir: lang === "ar" ? "rtl" : "ltr",
    setLang,
    toggle,
    // Zustand persisted store is hydrated on first client render; treat as ready
    ready: true,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx)
    throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
