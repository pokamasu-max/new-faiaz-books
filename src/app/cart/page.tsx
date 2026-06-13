"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useLang } from "@/context/LanguageContext";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { items, updateQty, removeItem, totalPrice } = useCart();
  const { t } = useLang();

  const shipping = items.length > 0 ? 60 : 0;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-6xl">🛒</p>
        <h1 className="mt-4 text-2xl font-extrabold text-ink">
          {t("cartEmpty")}
        </h1>
        <Link href="/books" className="btn-primary mt-6">
          {t("startShopping")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-extrabold text-ink">{t("shoppingCart")}</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Items */}
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="card flex gap-4 p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.coverImage}
                alt={item.title}
                className="h-28 w-20 shrink-0 rounded object-cover"
              />
              <div className="flex flex-1 flex-col">
                <Link
                  href={`/books/${item.id}`}
                  className="font-semibold text-ink hover:text-brand-600"
                >
                  {item.title}
                </Link>
                <p className="text-sm text-ink-light">{item.author}</p>
                <p className="mt-1 font-bold text-brand-600">
                  {formatPrice(item.price)}
                </p>

                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="flex items-center rounded-lg border border-gray-300">
                    <button
                      onClick={() => updateQty(item.id, item.quantity - 1)}
                      className="px-3 py-1 text-lg font-bold text-ink-light hover:bg-gray-50"
                    >
                      −
                    </button>
                    <span className="w-10 text-center font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQty(item.id, item.quantity + 1)}
                      className="px-3 py-1 text-lg font-bold text-ink-light hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-sm font-medium text-red-600 hover:underline"
                  >
                    {t("remove")}
                  </button>
                </div>
              </div>
              <div className="hidden shrink-0 text-right font-bold text-ink sm:block">
                {formatPrice(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="h-fit card p-6">
          <h2 className="font-bold text-ink">{t("orderSummary")}</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-light">{t("subtotal")}</dt>
              <dd className="font-medium">{formatPrice(totalPrice)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-light">{t("shipping")}</dt>
              <dd className="font-medium">{formatPrice(shipping)}</dd>
            </div>
            <div className="mt-2 flex justify-between border-t border-gray-100 pt-3 text-base">
              <dt className="font-bold text-ink">{t("total")}</dt>
              <dd className="font-bold text-brand-600">
                {formatPrice(totalPrice + shipping)}
              </dd>
            </div>
          </dl>
          <Link href="/checkout" className="btn-primary mt-5 w-full">
            {t("proceedToCheckout")}
          </Link>
          <Link
            href="/books"
            className="mt-3 block text-center text-sm font-medium text-brand-600 hover:underline"
          >
            {t("continueShopping")}
          </Link>
        </div>
      </div>
    </div>
  );
}
