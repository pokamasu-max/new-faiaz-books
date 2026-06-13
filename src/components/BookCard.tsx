"use client";

import Link from "next/link";
import { formatPrice, BN_PROGRAM, BN_YEAR, BN_TYPE, BN_SUBJECT } from "@/lib/format";
import { useLang } from "@/context/LanguageContext";
import StarRating from "./StarRating";

export type BookCardData = {
  id: string;
  title: string;
  titleBn?: string;
  author: string;
  publisher?: string;
  price: number;
  category: string; // subject
  program?: string;
  year?: string;
  bookType?: string;
  coverImage: string;
  rating: number;
  stock: number;
};

const typeColors: Record<string, string> = {
  Textbook: "bg-emerald-500",
  Guide: "bg-blue-500",
  Suggestion: "bg-purple-500",
  Notes: "bg-amber-500",
};

export default function BookCard({ book }: { book: BookCardData }) {
  const { lang } = useLang();
  const isBn = lang === "bn";
  const title = isBn && book.titleBn ? book.titleBn : book.title;
  const subject = isBn ? BN_SUBJECT[book.category] ?? book.category : book.category;
  const program = book.program
    ? isBn
      ? BN_PROGRAM[book.program] ?? book.program
      : book.program
    : "";
  const year = book.year ? (isBn ? BN_YEAR[book.year] ?? book.year : book.year) : "";
  const type = book.bookType
    ? isBn
      ? BN_TYPE[book.bookType] ?? book.bookType
      : book.bookType
    : "";

  return (
    <Link
      href={`/books/${book.id}`}
      className="card group flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={book.coverImage}
          alt={title}
          className="h-full w-full object-cover transition group-hover:scale-105"
        />
        {book.bookType && (
          <span
            className={`absolute left-2 top-2 rounded px-2 py-0.5 text-xs font-semibold text-white ${
              typeColors[book.bookType] ?? "bg-gray-600"
            }`}
          >
            {type}
          </span>
        )}
        {book.stock === 0 && (
          <span className="absolute right-2 top-2 rounded bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
            {isBn ? "স্টকে নেই" : "Out of stock"}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-3">
        <h3 className="line-clamp-2 font-semibold leading-snug text-ink group-hover:text-brand-600">
          {title}
        </h3>
        <p className="mt-0.5 text-xs text-ink-light">{subject}</p>
        {(program || year) && (
          <p className="mt-0.5 text-xs font-medium text-brand-600">
            {program} {year && `· ${year}`}
          </p>
        )}
        <div className="mt-1">
          <StarRating rating={book.rating} />
        </div>
        <div className="mt-auto pt-2">
          <span className="text-lg font-bold text-brand-600">
            {formatPrice(book.price)}
          </span>
        </div>
      </div>
    </Link>
  );
}
