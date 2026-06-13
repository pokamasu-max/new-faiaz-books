"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Lang, getDict, TFunc } from "@/lib/i18n";

type LanguageContextType = {
  lang: Lang;
  t: TFunc;
  toggle: () => void;
  setLang: (l: Lang) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({
  initialLang,
  children,
}: {
  initialLang: Lang;
  children: ReactNode;
}) {
  const [lang, setLangState] = useState<Lang>(initialLang);
  const router = useRouter();

  function setLang(l: Lang) {
    setLangState(l);
    document.cookie = `lang=${l}; path=/; max-age=31536000`;
    router.refresh();
  }

  function toggle() {
    setLang(lang === "en" ? "bn" : "en");
  }

  const t = getDict(lang);

  return (
    <LanguageContext.Provider value={{ lang, t, toggle, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
