import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login?callbackUrl=/admin");
  if ((session.user as any).role !== "ADMIN") redirect("/");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
        <aside className="h-fit card p-3">
          <p className="px-3 pb-2 text-xs font-bold uppercase tracking-wide text-ink-light">
            Admin
          </p>
          <nav className="space-y-1 text-sm">
            <Link
              href="/admin"
              className="block rounded-lg px-3 py-2 font-medium text-ink hover:bg-brand-50 hover:text-brand-600"
            >
              📊 Dashboard
            </Link>
            <Link
              href="/admin/books"
              className="block rounded-lg px-3 py-2 font-medium text-ink hover:bg-brand-50 hover:text-brand-600"
            >
              📚 Manage Books
            </Link>
            <Link
              href="/admin/orders"
              className="block rounded-lg px-3 py-2 font-medium text-ink hover:bg-brand-50 hover:text-brand-600"
            >
              🧾 Orders
            </Link>
            <Link
              href="/"
              className="block rounded-lg px-3 py-2 font-medium text-ink-light hover:bg-gray-50"
            >
              ← Back to store
            </Link>
          </nav>
        </aside>
        <div>{children}</div>
      </div>
    </div>
  );
}
