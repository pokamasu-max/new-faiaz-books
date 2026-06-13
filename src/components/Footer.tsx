import Link from "next/link";
import { getLang } from "@/lib/lang";
import { getDict } from "@/lib/i18n";
import { PROGRAMS, BN_PROGRAM } from "@/lib/format";

export default function Footer() {
  const lang = getLang();
  const t = getDict(lang);
  const label = (en: string, bn: string) => (lang === "bn" ? bn : en);

  return (
    <footer className="mt-16 border-t border-gray-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-500 text-lg font-black text-white">
              N
            </span>
            <span className="text-lg font-extrabold text-ink">
              {t("brand")}
            </span>
          </div>
          <p className="mt-3 text-sm text-ink-light">{t("footerAbout")}</p>
        </div>

        <div>
          <h4 className="mb-3 font-semibold text-ink">{t("programs")}</h4>
          <ul className="space-y-2 text-sm text-ink-light">
            {PROGRAMS.map((p) => (
              <li key={p}>
                <Link
                  href={`/books?program=${encodeURIComponent(p)}`}
                  className="hover:text-brand-600"
                >
                  {label(p, BN_PROGRAM[p])}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/books" className="hover:text-brand-600">
                {t("allBooks")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-semibold text-ink">{t("account")}</h4>
          <ul className="space-y-2 text-sm text-ink-light">
            <li><Link href="/login" className="hover:text-brand-600">{t("signIn")}</Link></li>
            <li><Link href="/register" className="hover:text-brand-600">{t("createAccount")}</Link></li>
            <li><Link href="/orders" className="hover:text-brand-600">{t("myOrders")}</Link></li>
            <li><Link href="/cart" className="hover:text-brand-600">{t("cart")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-semibold text-ink">{t("contact")}</h4>
          <ul className="space-y-2 text-sm text-ink-light">
            <li>📍 {label("Nilkhet Book Market, Dhaka-1205", "নীলক্ষেত বই মার্কেট, ঢাকা-১২০৫")}</li>
            <li>📞 +880 1700-000000</li>
            <li>✉️ hello@newfaiazbooks.com</li>
            <li>🕘 {label("Open daily 9am – 9pm", "প্রতিদিন সকাল ৯টা – রাত ৯টা")}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-100 py-4 text-center text-sm text-ink-light">
        © {new Date().getFullYear()} {t("brand")} ·{" "}
        {label("Nilkhet, Dhaka", "নীলক্ষেত, ঢাকা")}
      </div>
    </footer>
  );
}
