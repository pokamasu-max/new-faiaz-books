"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart, CartItem } from "@/context/CartContext";
import { useLang } from "@/context/LanguageContext";

export default function AddToCartButton({
  book,
  outOfStock,
}: {
  book: Omit<CartItem, "quantity">;
  outOfStock: boolean;
}) {
  const { addItem } = useCart();
  const { t } = useLang();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (outOfStock) {
    return (
      <button disabled className="btn-primary w-full cursor-not-allowed sm:w-auto">
        {t("outOfStock")}
      </button>
    );
  }

  function handleAdd() {
    addItem(book, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  function handleBuyNow() {
    addItem(book, qty);
    router.push("/cart");
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-ink-light">{t("quantity")}</span>
        <div className="flex items-center rounded-lg border border-gray-300">
          <button
            onClick={() => setQty((qn) => Math.max(1, qn - 1))}
            className="px-3 py-1.5 text-lg font-bold text-ink-light hover:bg-gray-50"
            aria-label="Decrease"
          >
            −
          </button>
          <span className="w-10 text-center font-semibold">{qty}</span>
          <button
            onClick={() => setQty((qn) => qn + 1)}
            className="px-3 py-1.5 text-lg font-bold text-ink-light hover:bg-gray-50"
            aria-label="Increase"
          >
            +
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <button onClick={handleAdd} className="btn-outline flex-1 sm:flex-none">
          {added ? t("added") : t("addToCart")}
        </button>
        <button onClick={handleBuyNow} className="btn-primary flex-1 sm:flex-none">
          {t("buyNow")}
        </button>
      </div>
    </div>
  );
}
