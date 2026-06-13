import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [bookCount, orderCount, userCount, orders, lowStock] = await Promise.all([
    prisma.book.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.book.findMany({
      where: { stock: { lte: 10 } },
      orderBy: { stock: "asc" },
      take: 5,
    }),
  ]);

  const revenue = (
    await prisma.order.findMany({
      where: { status: { not: "CANCELLED" } },
      select: { total: true },
    })
  ).reduce((s, o) => s + o.total, 0);

  const stats = [
    { label: "Total Revenue", value: formatPrice(revenue), emoji: "💰" },
    { label: "Orders", value: orderCount, emoji: "🧾" },
    { label: "Books", value: bookCount, emoji: "📚" },
    { label: "Customers", value: userCount, emoji: "👥" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-ink">Dashboard</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-5">
            <div className="text-2xl">{s.emoji}</div>
            <p className="mt-2 text-2xl font-bold text-ink">{s.value}</p>
            <p className="text-sm text-ink-light">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold text-ink">Recent orders</h2>
            <Link href="/admin/orders" className="text-sm font-medium text-brand-600">
              View all →
            </Link>
          </div>
          {orders.length === 0 ? (
            <p className="text-sm text-ink-light">No orders yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100 text-sm">
              {orders.map((o) => (
                <li key={o.id} className="flex items-center justify-between py-2">
                  <span className="font-medium text-ink">
                    #{o.id.slice(-6).toUpperCase()}
                  </span>
                  <span className="text-ink-light">{o.items.length} item(s)</span>
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                    {o.status}
                  </span>
                  <span className="font-semibold text-brand-600">
                    {formatPrice(o.total)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card p-5">
          <h2 className="mb-3 font-bold text-ink">⚠️ Low stock</h2>
          {lowStock.length === 0 ? (
            <p className="text-sm text-ink-light">All books are well stocked.</p>
          ) : (
            <ul className="divide-y divide-gray-100 text-sm">
              {lowStock.map((b) => (
                <li key={b.id} className="flex items-center justify-between py-2">
                  <span className="line-clamp-1 font-medium text-ink">{b.title}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      b.stock === 0
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {b.stock} left
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
