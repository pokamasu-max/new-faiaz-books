import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  formatPrice,
  BN_PROGRAM,
  BN_YEAR,
  BN_TYPE,
  BN_SUBJECT,
} from "@/lib/format";
import { getLang } from "@/lib/lang";
import { getDict } from "@/lib/i18n";
import AddToCartButton from "@/components/AddToCartButton";
import BookCard from "@/components/BookCard";
import StarRating from "@/components/StarRating";

export const dynamic = "force-dynamic";

export default async function BookDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const lang = getLang();
  const t = getDict(lang);
  const isBn = lang === "bn";
  const book = await prisma.book.findUnique({ where: { id: params.id } });
  if (!book) notFound();

  const related = await prisma.book.findMany({
    where: { category: book.category, id: { not: book.id } },
    take: 6,
  });

  const title = isBn && book.titleBn ? book.titleBn : book.title;
  const subject = isBn ? BN_SUBJECT[book.category] ?? book.category : book.category;
  const program = isBn ? BN_PROGRAM[book.program] ?? book.program : book.program;
  const year = isBn ? BN_YEAR[book.year] ?? book.year : book.year;
  const type = isBn ? BN_TYPE[book.bookType] ?? book.bookType : book.bookType;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-ink-light">
        <Link href="/" className="hover:text-brand-600">
          {isBn ? "হোম" : "Home"}
        </Link>
        <span className="mx-2">/</span>
        <Link href="/books" className="hover:text-brand-600">
          {t("allBooks")}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/books?category=${encodeURIComponent(book.category)}`}
          className="hover:text-brand-600"
        >
          {subject}
        </Link>
      </nav>

      <div className="grid gap-8 md:grid-cols-[320px_1fr]">
        {/* Cover */}
        <div>
          <div className="card overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={book.coverImage}
              alt={title}
              className="aspect-[2/3] w-full object-cover"
            />
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-600">
              {subject}
            </span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
              {type}
            </span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-ink-light">
              {program} · {year}
            </span>
          </div>

          <h1 className="mt-3 text-3xl font-extrabold text-ink">{title}</h1>
          {isBn && book.titleBn && book.title !== book.titleBn && (
            <p className="text-base text-ink-light">{book.title}</p>
          )}
          <p className="mt-1 text-lg text-ink-light">
            {t("author")}: {book.author}
            {book.publisher && (
              <>
                {" · "}
                {t("publisher")}: {book.publisher}
              </>
            )}
          </p>

          <div className="mt-3 flex items-center gap-2">
            <StarRating rating={book.rating} />
            <span className="text-sm text-ink-light">({book.rating.toFixed(1)})</span>
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-brand-600">
              {formatPrice(book.price)}
            </span>
            {book.stock > 0 ? (
              <span className="text-sm font-medium text-green-600">
                ● {t("inStock")} ({book.stock} {t("available")})
              </span>
            ) : (
              <span className="text-sm font-medium text-red-600">● {t("outOfStock")}</span>
            )}
          </div>

          <p className="mt-5 leading-relaxed text-ink-light">{book.description}</p>

          <div className="mt-8 max-w-md">
            <AddToCartButton
              book={{
                id: book.id,
                title: book.title,
                author: book.author,
                price: book.price,
                coverImage: book.coverImage,
              }}
              outOfStock={book.stock === 0}
            />
          </div>

          <dl className="mt-8 grid max-w-md grid-cols-2 gap-y-2 border-t border-gray-100 pt-6 text-sm">
            <dt className="text-ink-light">{t("program")}</dt>
            <dd className="font-medium text-ink">{program}</dd>
            <dt className="text-ink-light">{t("year")}</dt>
            <dd className="font-medium text-ink">{year}</dd>
            <dt className="text-ink-light">{t("subject")}</dt>
            <dd className="font-medium text-ink">{subject}</dd>
            <dt className="text-ink-light">{t("type")}</dt>
            <dd className="font-medium text-ink">{type}</dd>
            {book.publisher && (
              <>
                <dt className="text-ink-light">{t("publisher")}</dt>
                <dd className="font-medium text-ink">{book.publisher}</dd>
              </>
            )}
          </dl>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-5 text-xl font-bold text-ink">{t("alsoLike")}</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {related.map((b) => (
              <BookCard key={b.id} book={b} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
