"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Language } from "@/lib/i18n";

interface LanguageState {
  lang: Language;
  setLang: (lang: Language) => void;
  toggle: () => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      lang: "ar",
      setLang: (lang) => set({ lang }),
      toggle: () =>
        set((state) => ({ lang: state.lang === "ar" ? "en" : "ar" })),
    }),
    {
      name: "mahdy-lang",
    }
  )
);
