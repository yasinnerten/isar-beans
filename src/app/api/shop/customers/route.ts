import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const shop = await getSession();
  if (!shop) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const walletCards = await prisma.walletCard.findMany({
    where: { shopId: shop.id },
    include: { customer: true },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(walletCards);
}
