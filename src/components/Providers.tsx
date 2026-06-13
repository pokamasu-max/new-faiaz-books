"use client";

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/context/CartContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { Lang } from "@/lib/i18n";
import { ReactNode } from "react";

export default function Providers({
  children,
  lang,
}: {
  children: ReactNode;
  lang: Lang;
}) {
  return (
    <SessionProvider>
      <LanguageProvider initialLang={lang}>
        <CartProvider>{children}</CartProvider>
      </LanguageProvider>
    </SessionProvider>
  );
}
