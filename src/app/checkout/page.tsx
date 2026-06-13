"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useLang } from "@/context/LanguageContext";
import { formatPrice } from "@/lib/format";

export default function CheckoutPage() {
  const { items, totalPrice, clear } = useCart();
  const { t, lang } = useLang();
  const { data: session, status } = useSession();
  const router = useRouter();
  const label = (en: string, bn: string) => (lang === "bn" ? bn : en);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    paymentMethod: "COD",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const shipping = items.length > 0 ? 60 : 0;
  const grandTotal = totalPrice + shipping;

  // Pre-fill name from session
  useEffect(() => {
    if (session?.user?.name) {
      setForm((f) => (f.fullName ? f : { ...f, fullName: session.user!.name! }));
    }
  }, [session]);

  if (status === "loading") {
    return <div className="py-20 text-center text-ink-light">Loading…</div>;
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-5xl">🔒</p>
        <h1 className="mt-4 text-2xl font-extrabold text-ink">
          {label("Please sign in to checkout", "চেকআউট করতে লগ ইন করুন")}
        </h1>
        <Link href="/login?callbackUrl=/checkout" className="btn-primary mt-6">
          {t("signIn")}
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-5xl">🛒</p>
        <h1 className="mt-4 text-2xl font-extrabold text-ink">
          {t("cartEmpty")}
        </h1>
        <Link href="/books" className="btn-primary mt-6">
          {t("startShopping")}
        </Link>
      </div>
    );
  }

  function update(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
        fullName: form.fullName,
        phone: form.phone,
        address: form.address,
        city: form.city,
        paymentMethod: form.paymentMethod,
      }),
    });

    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Could not place order.");
      return;
    }

    clear();
    router.push(`/orders/${data.orderId}?success=1`);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-extrabold text-ink">{t("checkout")}</h1>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      <form
        onSubmit={placeOrder}
        className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]"
      >
        {/* Details */}
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="mb-4 font-bold text-ink">
              {label("Shipping details", "ডেলিভারির তথ্য")}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium">
                  {label("Full name", "পুরো নাম")}
                </label>
                <input
                  required
                  className="input"
                  value={form.fullName}
                  onChange={(e) => update("fullName", e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  {label("Phone", "ফোন নম্বর")}
                </label>
                <input
                  required
                  className="input"
                  placeholder="01XXXXXXXXX"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  {label("City / District", "শহর / জেলা")}
                </label>
                <input
                  required
                  className="input"
                  placeholder={label("Dhaka", "ঢাকা")}
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium">
                  {label("Full address", "সম্পূর্ণ ঠিকানা")}
                </label>
                <textarea
                  required
                  rows={3}
                  className="input"
                  placeholder="House, road, area..."
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="mb-4 font-bold text-ink">
              {label("Payment method", "পেমেন্ট মাধ্যম")}
            </h2>
            <div className="space-y-3">
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-4 has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50">
                <input
                  type="radio"
                  name="payment"
                  checked={form.paymentMethod === "COD"}
                  onChange={() => update("paymentMethod", "COD")}
                />
                <div>
                  <p className="font-semibold text-ink">
                    {label("Cash on Delivery", "ক্যাশ অন ডেলিভারি")}
                  </p>
                  <p className="text-sm text-ink-light">
                    {label(
                      "Pay with cash when your order arrives.",
                      "বই হাতে পেয়ে নগদ টাকা দিন।"
                    )}
                  </p>
                </div>
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-4 has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50">
                <input
                  type="radio"
                  name="payment"
                  checked={form.paymentMethod === "ONLINE"}
                  onChange={() => update("paymentMethod", "ONLINE")}
                />
                <div>
                  <p className="font-semibold text-ink">
                    {label("Online Payment", "অনলাইন পেমেন্ট")}{" "}
                    <span className="ml-1 rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-700">
                      {label("Demo", "ডেমো")}
                    </span>
                  </p>
                  <p className="text-sm text-ink-light">
                    {label(
                      "Card / bKash / Nagad — simulated for this demo.",
                      "কার্ড / বিকাশ / নগদ — ডেমোর জন্য সিমুলেটেড।"
                    )}
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="h-fit card p-6">
          <h2 className="font-bold text-ink">{t("orderSummary")}</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {items.map((i) => (
              <li key={i.id} className="flex justify-between gap-2">
                <span className="text-ink-light">
                  {i.title}{" "}
                  <span className="text-xs">× {i.quantity}</span>
                </span>
                <span className="font-medium">
                  {formatPrice(i.price * i.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-light">{t("subtotal")}</dt>
              <dd className="font-medium">{formatPrice(totalPrice)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-light">{t("shipping")}</dt>
              <dd className="font-medium">{formatPrice(shipping)}</dd>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-2 text-base">
              <dt className="font-bold text-ink">{t("total")}</dt>
              <dd className="font-bold text-brand-600">
                {formatPrice(grandTotal)}
              </dd>
            </div>
          </dl>
          <button type="submit" disabled={loading} className="btn-primary mt-5 w-full">
            {loading
              ? label("Placing order…", "অর্ডার হচ্ছে…")
              : form.paymentMethod === "ONLINE"
              ? `${label("Pay", "পরিশোধ")} ${formatPrice(grandTotal)}`
              : t("placeOrder")}
          </button>
        </div>
      </form>
    </div>
  );
}
