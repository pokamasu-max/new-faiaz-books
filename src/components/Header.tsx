"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import { useLang } from "@/context/LanguageContext";
import { PROGRAMS, BN_PROGRAM, SUBJECTS, BN_SUBJECT } from "@/lib/format";
import { useState } from "react";

export default function Header() {
  const { totalItems } = useCart();
  const { t, lang, toggle } = useLang();
  const { data: session } = useSession();
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [menuOpen, setMenuOpen] = useState(false);

  const isAdmin = (session?.user as any)?.role === "ADMIN";
  const label = (en: string, bn: string) => (lang === "bn" ? bn : en);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/books?q=${encodeURIComponent(q)}`);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-500 text-lg font-black text-white">
            N
          </span>
          <span className="hidden text-base font-extrabold leading-tight text-ink sm:block">
            {lang === "bn" ? (
              <>
                নিউ ফাইয়াজ <span className="text-brand-500">বুকস</span>
              </>
            ) : (
              <>
                New Faiaz <span className="text-brand-500">Books</span>
              </>
            )}
          </span>
        </Link>

        {/* Search */}
        <form onSubmit={onSearch} className="flex flex-1 items-center">
          <div className="relative w-full">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full rounded-full border border-gray-300 bg-gray-50 px-5 py-2.5 pr-12 text-sm outline-none focus:border-brand-500 focus:bg-white"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-brand-500 p-2 text-white hover:bg-brand-600"
              aria-label="Search"
            >
              <SearchIcon />
            </button>
          </div>
        </form>

        {/* Actions */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {/* Language toggle */}
          <button
            onClick={toggle}
            className="rounded-lg border border-gray-300 px-2.5 py-1.5 text-sm font-semibold text-ink hover:bg-gray-50"
            title="Switch language"
          >
            {lang === "en" ? "বাং" : "EN"}
          </button>

          <Link
            href="/cart"
            className="relative flex items-center gap-1 rounded-lg px-2 py-2 text-ink hover:bg-gray-100"
          >
            <CartIcon />
            <span className="hidden sm:inline">{t("cart")}</span>
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-brand-500 px-1 text-xs font-bold text-white">
                {totalItems}
              </span>
            )}
          </Link>

          {session ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-gray-100"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                  {session.user?.name?.[0]?.toUpperCase() ?? "U"}
                </span>
              </button>
              {menuOpen && (
                <div
                  className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-lg"
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  <div className="border-b border-gray-100 px-4 py-2 text-sm">
                    <p className="font-semibold">{session.user?.name}</p>
                    <p className="truncate text-xs text-ink-light">
                      {session.user?.email}
                    </p>
                  </div>
                  <Link
                    href="/orders"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    {t("myOrders")}
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 text-sm font-medium text-brand-600 hover:bg-gray-50"
                    >
                      {t("adminDashboard")}
                    </Link>
                  )}
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50"
                  >
                    {t("signOut")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="btn-primary px-3 py-2 text-sm">
              {t("signIn")}
            </Link>
          )}
        </nav>
      </div>

      {/* Program + subject bar */}
      <div className="border-t border-gray-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 py-2 text-sm">
          <Link
            href="/books"
            className="whitespace-nowrap rounded-full px-3 py-1 font-semibold text-ink hover:bg-brand-50 hover:text-brand-600"
          >
            {t("allBooks")}
          </Link>
          <span className="mx-1 h-4 w-px bg-gray-200" />
          {PROGRAMS.map((p) => (
            <Link
              key={p}
              href={`/books?program=${encodeURIComponent(p)}`}
              className="whitespace-nowrap rounded-full px-3 py-1 font-medium text-ink-light hover:bg-brand-50 hover:text-brand-600"
            >
              {label(p, BN_PROGRAM[p])}
            </Link>
          ))}
          <span className="mx-1 h-4 w-px bg-gray-200" />
          {["Accounting", "Management", "Economics", "Bangla", "English", "Political Science"].map(
            (s) => (
              <Link
                key={s}
                href={`/books?category=${encodeURIComponent(s)}`}
                className="whitespace-nowrap rounded-full px-3 py-1 font-medium text-ink-light hover:bg-brand-50 hover:text-brand-600"
              >
                {label(s, BN_SUBJECT[s] ?? s)}
              </Link>
            )
          )}
        </div>
      </div>
    </header>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
    </svg>
  );
}
