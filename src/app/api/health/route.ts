import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// TEMPORARY diagnostic endpoint — remove after debugging.
export async function GET() {
  const url = process.env.DATABASE_URL || "";
  const info: any = {
    hasDatabaseUrl: Boolean(url),
    hasNextAuthSecret: Boolean(process.env.NEXTAUTH_SECRET),
    nextAuthUrl: process.env.NEXTAUTH_URL || null,
    // mask credentials, show only host portion
    dbHost: url ? url.replace(/^.*@/, "").split("/")[0] : null,
    dbParams: url.includes("?") ? url.split("?")[1] : null,
  };
  try {
    const count = await prisma.book.count();
    info.dbConnection = "OK";
    info.bookCount = count;
  } catch (e: any) {
    info.dbConnection = "FAILED";
    info.error = String(e?.message || e).slice(0, 500);
  }
  return NextResponse.json(info);
}
