import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  PAID: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-indigo-100 text-indigo-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default async function OrderDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { success?: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true },
  });

  if (!order) notFound();

  // Only the owner (or an admin) can view.
  const isOwner = order.userId === (session.user as any).id;
  const isAdmin = (session.user as any).role === "ADMIN";
  if (!isOwner && !isAdmin) redirect("/orders");

  const isSuccess = searchParams.success === "1";
  const subtotal = order.items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {isSuccess && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-5 text-center">
          <p className="text-4xl">🎉</p>
          <h2 className="mt-2 text-xl font-bold text-green-800">
            Order placed successfully!
          </h2>
          <p className="text-sm text-green-700">
            Thank you for shopping with New Faiaz Books.
            {order.paymentMethod === "COD"
              ? " Please keep cash ready for delivery."
              : " Your payment was received."}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <Link href="/orders" className="text-sm font-medium text-brand-600 hover:underline">
          ← All orders
        </Link>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            statusColors[order.status] ?? "bg-gray-100 text-gray-700"
          }`}
        >
          {order.status}
        </span>
      </div>

      <h1 className="mt-3 text-2xl font-extrabold text-ink">
        Order #{order.id.slice(-8).toUpperCase()}
      </h1>
      <p className="text-sm text-ink-light">
        Placed on{" "}
        {new Date(order.createdAt).toLocaleString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="card p-5">
          <h3 className="font-semibold text-ink">Shipping to</h3>
          <div className="mt-2 text-sm text-ink-light">
            <p className="font-medium text-ink">{order.fullName}</p>
            <p>{order.phone}</p>
            <p>{order.address}</p>
            <p>{order.city}</p>
          </div>
        </div>
        <div className="card p-5">
          <h3 className="font-semibold text-ink">Payment</h3>
          <div className="mt-2 text-sm text-ink-light">
            <p>
              Method:{" "}
              <span className="font-medium text-ink">
                {order.paymentMethod === "COD"
                  ? "Cash on Delivery"
                  : "Online (Demo)"}
              </span>
            </p>
            {order.paymentRef && <p>Ref: {order.paymentRef}</p>}
            <p>
              Status:{" "}
              <span className="font-medium text-ink">{order.status}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="card mt-6 overflow-hidden">
        <div className="border-b border-gray-100 px-5 py-3 font-semibold text-ink">
          Items
        </div>
        <ul className="divide-y divide-gray-100">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center justify-between px-5 py-3">
              <div>
                <Link
                  href={`/books/${item.bookId}`}
                  className="font-medium text-ink hover:text-brand-600"
                >
                  {item.title}
                </Link>
                <p className="text-sm text-ink-light">
                  {formatPrice(item.price)} × {item.quantity}
                </p>
              </div>
              <span className="font-semibold text-ink">
                {formatPrice(item.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <dl className="space-y-1 border-t border-gray-100 px-5 py-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-light">Subtotal</dt>
            <dd>{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-light">Shipping</dt>
            <dd>{formatPrice(order.total - subtotal)}</dd>
          </div>
          <div className="flex justify-between border-t border-gray-100 pt-2 text-base font-bold">
            <dt className="text-ink">Total</dt>
            <dd className="text-brand-600">{formatPrice(order.total)}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
