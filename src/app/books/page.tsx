import Link from "next/link";
import { prisma } from "@/lib/prisma";
import BookCard from "@/components/BookCard";
import { getLang } from "@/lib/lang";
import { getDict } from "@/lib/i18n";
import {
  PROGRAMS,
  ALL_YEARS,
  SUBJECTS,
  BOOK_TYPES,
  BN_PROGRAM,
  BN_YEAR,
  BN_TYPE,
  BN_SUBJECT,
} from "@/lib/format";

export const dynamic = "force-dynamic";

type SearchParams = {
  q?: string;
  program?: string;
  year?: string;
  category?: string;
  bookType?: string;
  sort?: string;
};

export default async function BooksPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const lang = getLang();
  const t = getDict(lang);
  const isBn = lang === "bn";
  const { q, program, year, category, bookType, sort } = searchParams;

  const where: any = {};
  if (program) where.program = program;
  if (year) where.year = year;
  if (category) where.category = category;
  if (bookType) where.bookType = bookType;
  if (q) {
    const mode = "insensitive" as const;
    where.OR = [
      { title: { contains: q, mode } },
      { titleBn: { contains: q } }, // Bangla: case folding not applicable
      { author: { contains: q, mode } },
      { publisher: { contains: q, mode } },
      { category: { contains: q, mode } },
    ];
  }

  let orderBy: any = { createdAt: "desc" };
  if (sort === "price-asc") orderBy = { price: "asc" };
  else if (sort === "price-desc") orderBy = { price: "desc" };
  else if (sort === "rating") orderBy = { rating: "desc" };

  const books = await prisma.book.findMany({ where, orderBy });

  // Build a URL that toggles one filter while preserving the others.
  function buildHref(overrides: Partial<SearchParams>) {
    const merged: any = { q, program, year, category, bookType, sort, ...overrides };
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(merged)) {
      if (v) sp.set(k, String(v));
    }
    const s = sp.toString();
    return `/books${s ? `?${s}` : ""}`;
  }

  const heading = category
    ? isBn
      ? BN_SUBJECT[category] ?? category
      : category
    : program
    ? isBn
      ? BN_PROGRAM[program] ?? program
      : program
    : q
    ? `${t("resultsFor")} “${q}”`
    : t("allBooks");

  const hasFilters = program || year || category || bookType || q;

  function FilterGroup({
    title,
    items,
    paramKey,
    active,
    bnMap,
  }: {
    title: string;
    items: readonly string[];
    paramKey: keyof SearchParams;
    active?: string;
    bnMap?: Record<string, string>;
  }) {
    return (
      <div className="card p-4">
        <h3 className="mb-2 text-sm font-bold text-ink">{title}</h3>
        <ul className="space-y-1 text-sm">
          {items.map((item) => {
            const isActive = active === item;
            return (
              <li key={item}>
                <Link
                  href={buildHref({ [paramKey]: isActive ? undefined : item } as any)}
                  className={`block rounded px-2 py-1.5 ${
                    isActive
                      ? "bg-brand-50 font-semibold text-brand-600"
                      : "text-ink-light hover:bg-gray-50"
                  }`}
                >
                  {isActive ? "✓ " : ""}
                  {isBn && bnMap ? bnMap[item] ?? item : item}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-extrabold text-ink">{heading}</h1>
          <p className="mt-1 text-sm text-ink-light">
            {books.length}{" "}
            {isBn ? t("booksFound") : books.length === 1 ? t("bookFound") : t("booksFound")}
          </p>
        </div>
        {hasFilters && (
          <Link href="/books" className="btn-outline px-4 py-2 text-sm">
            {t("clearFilters")}
          </Link>
        )}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[230px_1fr]">
        {/* Sidebar */}
        <aside className="space-y-4">
          <FilterGroup
            title={t("program")}
            items={PROGRAMS}
            paramKey="program"
            active={program}
            bnMap={BN_PROGRAM}
          />
          <FilterGroup
            title={t("year")}
            items={ALL_YEARS}
            paramKey="year"
            active={year}
            bnMap={BN_YEAR}
          />
          <FilterGroup
            title={t("type")}
            items={BOOK_TYPES}
            paramKey="bookType"
            active={bookType}
            bnMap={BN_TYPE}
          />
          <FilterGroup
            title={t("subject")}
            items={SUBJECTS}
            paramKey="category"
            active={category}
            bnMap={BN_SUBJECT}
          />
        </aside>

        {/* Results */}
        <div>
          <form
            method="get"
            className="mb-4 flex flex-wrap items-center justify-end gap-2"
          >
            {q && <input type="hidden" name="q" value={q} />}
            {program && <input type="hidden" name="program" value={program} />}
            {year && <input type="hidden" name="year" value={year} />}
            {category && <input type="hidden" name="category" value={category} />}
            {bookType && <input type="hidden" name="bookType" value={bookType} />}
            <label className="text-sm text-ink-light">{t("sortBy")}</label>
            <select
              name="sort"
              defaultValue={sort ?? "latest"}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
            >
              <option value="latest">{t("newest")}</option>
              <option value="price-asc">{t("priceLow")}</option>
              <option value="price-desc">{t("priceHigh")}</option>
              <option value="rating">{t("topRated")}</option>
            </select>
            <button className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium hover:bg-gray-200">
              {t("apply")}
            </button>
          </form>

          {books.length === 0 ? (
            <div className="card grid place-items-center p-12 text-center">
              <p className="text-4xl">🔍</p>
              <p className="mt-3 font-semibold text-ink">{t("noBooks")}</p>
              <p className="text-sm text-ink-light">{t("noBooksHint")}</p>
              <Link href="/books" className="btn-outline mt-4">
                {t("clearFilters")}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {books.map((b) => (
                <BookCard key={b.id} book={b} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
