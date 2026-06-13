import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Suspense } from "react";
import { getLang } from "@/lib/lang";

const bangla = Hind_Siliguri({
  subsets: ["latin", "bengali"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "New Faiaz Books — National University Books, Nilkhet",
  description:
    "Buy National University (Honours, Degree, Masters) textbooks, guides, suggestions and notes online from New Faiaz Books, Nilkhet, Dhaka.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lang = getLang();
  return (
    <html lang={lang} className={bangla.variable}>
      <body className="flex min-h-screen flex-col font-sans">
        <Providers lang={lang}>
          <Suspense fallback={<div className="h-16 border-b bg-white" />}>
            <Header />
          </Suspense>
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
