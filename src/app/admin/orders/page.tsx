import { prisma } from "@/lib/prisma";
import AdminOrdersTable from "./OrdersTable";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { items: true, user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  const plain = orders.map((o) => ({
    id: o.id,
    customer: o.user?.name ?? "—",
    email: o.user?.email ?? "",
    total: o.total,
    status: o.status,
    paymentMethod: o.paymentMethod,
    itemCount: o.items.length,
    createdAt: o.createdAt.toISOString(),
  }));

  return <AdminOrdersTable initialOrders={plain} />;
}
