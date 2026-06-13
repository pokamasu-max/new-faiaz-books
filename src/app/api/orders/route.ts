import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Create a new order (checkout). Payment is mocked here — in production you would
// call a real gateway (Stripe / SSLCommerz / bKash) and confirm before marking PAID.
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { items, fullName, phone, address, city, paymentMethod } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    }
    if (!fullName || !phone || !address || !city) {
      return NextResponse.json(
        { error: "Please fill in all shipping details." },
        { status: 400 }
      );
    }

    // Re-fetch prices from DB so the client can't tamper with them.
    const ids = items.map((i: any) => i.id);
    const books = await prisma.book.findMany({ where: { id: { in: ids } } });
    const bookMap = new Map(books.map((b) => [b.id, b]));

    let total = 0;
    const orderItems = [];
    for (const i of items) {
      const book = bookMap.get(i.id);
      if (!book) continue;
      const qty = Math.max(1, Number(i.quantity) || 1);
      total += book.price * qty;
      orderItems.push({
        bookId: book.id,
        title: book.title,
        price: book.price,
        quantity: qty,
      });
    }

    if (orderItems.length === 0) {
      return NextResponse.json(
        { error: "None of the items are available." },
        { status: 400 }
      );
    }

    const shipping = 60;
    total += shipping;

    // --- Mock payment gateway ---
    const isOnline = paymentMethod === "ONLINE";
    const paymentRef = isOnline
      ? "MOCK-" + Math.round(total) + "-" + orderItems.length + "X"
      : null;
    const status = isOnline ? "PAID" : "PENDING";

    const order = await prisma.order.create({
      data: {
        userId: (session.user as any).id,
        total,
        status,
        fullName,
        phone,
        address,
        city,
        paymentMethod: isOnline ? "ONLINE" : "COD",
        paymentRef,
        items: { create: orderItems },
      },
    });

    // Decrement stock (best-effort).
    for (const oi of orderItems) {
      await prisma.book.update({
        where: { id: oi.bookId },
        data: { stock: { decrement: oi.quantity } },
      });
    }

    return NextResponse.json({ ok: true, orderId: order.id }, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: "Could not place the order. Please try again." },
      { status: 500 }
    );
  }
}

// List the signed-in user's orders.
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: { userId: (session.user as any).id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ orders });
}
