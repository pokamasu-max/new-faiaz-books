import Link from "next/link";
import { prisma } from "@/lib/prisma";
import BookCard from "@/components/BookCard";
import { getLang } from "@/lib/lang";
import { getDict } from "@/lib/i18n";
import {
  PROGRAMS,
  BN_PROGRAM,
  BN_SUBJECT,
} from "@/lib/format";

export const dynamic = "force-dynamic";

const programMeta: Record<string, { emoji: string; color: string }> = {
  Honours: { emoji: "🎓", color: "from-emerald-500 to-emerald-700" },
  Degree: { emoji: "📘", color: "from-sky-500 to-sky-700" },
  Masters: { emoji: "🏅", color: "from-purple-500 to-purple-700" },
};

const popularSubjects = [
  "Accounting",
  "Management",
  "Finance & Banking",
  "Marketing",
  "Economics",
  "Political Science",
  "Bangla",
  "English",
  "Sociology",
  "Philosophy",
  "Mathematics",
  "History",
];

export default async function HomePage() {
  const lang = getLang();
  const t = getDict(lang);
  const isBn = lang === "bn";
  const label = (en: string, bn: string) => (isBn ? bn : en);

  const [featured, latest] = await Promise.all([
    prisma.book.findMany({ where: { featured: true }, take: 6 }),
    prisma.book.findMany({ orderBy: { createdAt: "desc" }, take: 12 }),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-500 to-brand-700 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-14 md:grid-cols-2">
          <div>
            <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-medium">
              {t("heroBadge")}
            </span>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight md:text-5xl">
              {t("heroTitle")}
            </h1>
            <p className="mt-4 max-w-md text-lg text-white/90">
              {t("heroSubtitle")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/books"
                className="rounded-lg bg-white px-6 py-3 font-semibold text-brand-700 transition hover:bg-brand-50"
              >
                {t("browseAll")}
              </Link>
              <Link
                href="/books?program=Honours"
                className="rounded-lg border border-white/60 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                {label("Honours books", "অনার্সের বই")}
              </Link>
            </div>
          </div>
          <div className="hidden justify-center md:flex">
            <div className="flex gap-3">
              {featured.slice(0, 3).map((b, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={b.id}
                  src={b.coverImage}
                  alt={b.title}
                  className={`h-64 w-44 rounded-lg object-cover shadow-2xl ${
                    i === 1 ? "-mt-6" : "mt-6"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <h2 className="mb-5 text-xl font-bold text-ink">{t("shopByProgram")}</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {PROGRAMS.map((p) => (
            <Link
              key={p}
              href={`/books?program=${encodeURIComponent(p)}`}
              className={`flex items-center gap-4 rounded-xl bg-gradient-to-br ${programMeta[p].color} p-5 text-white transition hover:-translate-y-0.5 hover:shadow-lg`}
            >
              <span className="text-3xl">{programMeta[p].emoji}</span>
              <div>
                <p className="text-lg font-bold">
                  {label(p, BN_PROGRAM[p])}
                </p>
                <p className="text-sm text-white/80">
                  {label("Textbooks, guides & notes", "মূল বই, গাইড ও নোট")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Subjects */}
      <section className="mx-auto max-w-7xl px-4 py-4">
        <h2 className="mb-5 text-xl font-bold text-ink">{t("shopBySubject")}</h2>
        <div className="flex flex-wrap gap-2">
          {popularSubjects.map((s) => (
            <Link
              key={s}
              href={`/books?category=${encodeURIComponent(s)}`}
              className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-ink transition hover:border-brand-500 hover:bg-brand-50 hover:text-brand-600"
            >
              {label(s, BN_SUBJECT[s] ?? s)}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-5 flex items-end justify-between">
          <h2 className="text-xl font-bold text-ink">⭐ {t("featuredPicks")}</h2>
          <Link href="/books" className="text-sm font-semibold text-brand-600 hover:underline">
            {t("viewAll")} →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {featured.map((b) => (
            <BookCard key={b.id} book={b} />
          ))}
        </div>
      </section>

      {/* Latest */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        <h2 className="mb-5 text-xl font-bold text-ink">🆕 {t("newArrivals")}</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {latest.map((b) => (
            <BookCard key={b.id} book={b} />
          ))}
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-gray-100 bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 text-center sm:grid-cols-3">
          <div>
            <p className="text-2xl">🚚</p>
            <p className="mt-1 font-semibold text-ink">
              {label("Fast delivery", "দ্রুত ডেলিভারি")}
            </p>
            <p className="text-sm text-ink-light">
              {label("Across Bangladesh in 2–5 days", "সারা বাংলাদেশে ২–৫ দিনে")}
            </p>
          </div>
          <div>
            <p className="text-2xl">💳</p>
            <p className="mt-1 font-semibold text-ink">
              {label("Cash on Delivery", "ক্যাশ অন ডেলিভারি")}
            </p>
            <p className="text-sm text-ink-light">
              {label("Pay when you receive", "বই পেয়ে টাকা দিন")}
            </p>
          </div>
          <div>
            <p className="text-2xl">📚</p>
            <p className="mt-1 font-semibold text-ink">
              {label("Genuine NU books", "আসল এনইউ বই")}
            </p>
            <p className="text-sm text-ink-light">
              {label("Latest syllabus editions", "সর্বশেষ সিলেবাস")}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
