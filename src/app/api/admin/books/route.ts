import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const books = await prisma.book.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ books });
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const b = await req.json();
    if (!b.title || !b.author || !b.category) {
      return NextResponse.json(
        { error: "Title, author and category are required." },
        { status: 400 }
      );
    }
    const book = await prisma.book.create({
      data: {
        title: b.title,
        titleBn: b.titleBn || "",
        author: b.author,
        publisher: b.publisher || "",
        description: b.description || "",
        price: Number(b.price) || 0,
        program: b.program || "Honours",
        year: b.year || "",
        category: b.category,
        bookType: b.bookType || "Textbook",
        coverImage:
          b.coverImage ||
          `https://placehold.co/400x600/1f2933/ffffff/png?text=${encodeURIComponent(
            b.category + " " + (b.program || "")
          )}`,
        stock: Number(b.stock) || 0,
        rating: Number(b.rating) || 0,
        featured: Boolean(b.featured),
      },
    });
    return NextResponse.json({ book }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Could not create book." }, { status: 500 });
  }
}
