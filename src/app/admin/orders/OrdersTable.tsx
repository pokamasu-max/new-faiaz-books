"use client";

import { useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/format";

type Order = {
  id: string;
  customer: string;
  email: string;
  total: number;
  status: string;
  paymentMethod: string;
  itemCount: number;
  createdAt: string;
};

const STATUSES = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  PAID: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-indigo-100 text-indigo-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function AdminOrdersTable({
  initialOrders,
}: {
  initialOrders: Order[];
}) {
  const [orders, setOrders] = useState(initialOrders);
  const [updating, setUpdating] = useState<string | null>(null);

  async function changeStatus(id: string, status: string) {
    setUpdating(id);
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setUpdating(null);
    if (res.ok) {
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status } : o))
      );
    } else {
      alert("Could not update order status.");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-ink">Orders</h1>
      <p className="mt-1 text-sm text-ink-light">{orders.length} order(s)</p>

      {orders.length === 0 ? (
        <div className="card mt-6 p-12 text-center text-ink-light">
          No orders yet.
        </div>
      ) : (
        <div className="card mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase text-ink-light">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/orders/${o.id}`}
                      className="font-medium text-brand-600 hover:underline"
                    >
                      #{o.id.slice(-6).toUpperCase()}
                    </Link>
                    <p className="text-xs text-ink-light">{o.itemCount} item(s)</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{o.customer}</p>
                    <p className="text-xs text-ink-light">{o.email}</p>
                  </td>
                  <td className="px-4 py-3 text-ink-light">
                    {new Date(o.createdAt).toLocaleDateString("en-GB")}
                  </td>
                  <td className="px-4 py-3 text-ink-light">
                    {o.paymentMethod === "COD" ? "COD" : "Online"}
                  </td>
                  <td className="px-4 py-3 font-semibold text-brand-600">
                    {formatPrice(o.total)}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={o.status}
                      disabled={updating === o.id}
                      onChange={(e) => changeStatus(o.id, e.target.value)}
                      className={`rounded-full border-0 px-3 py-1 text-xs font-semibold outline-none ${
                        statusColors[o.status] ?? "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
