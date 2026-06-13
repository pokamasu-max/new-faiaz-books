import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

const VALID = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const { status } = await req.json();
    if (!VALID.includes(status)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }
    const order = await prisma.order.update({
      where: { id: params.id },
      data: { status },
    });
    return NextResponse.json({ order });
  } catch (e) {
    return NextResponse.json({ error: "Could not update order." }, { status: 500 });
  }
}
