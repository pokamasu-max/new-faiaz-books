import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const b = await req.json();
    const book = await prisma.book.update({
      where: { id: params.id },
      data: {
        title: b.title,
        titleBn: b.titleBn || "",
        author: b.author,
        publisher: b.publisher || "",
        description: b.description,
        price: Number(b.price) || 0,
        program: b.program || "Honours",
        year: b.year || "",
        category: b.category,
        bookType: b.bookType || "Textbook",
        coverImage: b.coverImage,
        stock: Number(b.stock) || 0,
        rating: Number(b.rating) || 0,
        featured: Boolean(b.featured),
      },
    });
    return NextResponse.json({ book });
  } catch (e) {
    return NextResponse.json({ error: "Could not update book." }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    await prisma.book.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: "Could not delete. The book may be part of an order." },
      { status: 500 }
    );
  }
}
