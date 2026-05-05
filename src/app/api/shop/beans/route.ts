import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

// Buy beans directly for a customer (manual top-up)
export async function POST(req: NextRequest) {
  const shop = await getSession();
  if (!shop) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { customerId, amount } = await req.json();

  if (!customerId || !amount || amount < 1) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const currentShop = await prisma.shop.findUnique({ where: { id: shop.id } });
  if (!currentShop || currentShop.beansBalance < amount) {
    return NextResponse.json({ error: "Insufficient beans balance" }, { status: 402 });
  }

  // Find wallet card for this customer
  const card = await prisma.walletCard.findUnique({
    where: { shopId_customerId: { shopId: shop.id, customerId } },
  });

  if (!card) {
    return NextResponse.json({ error: "No wallet card found for this customer" }, { status: 404 });
  }

  await prisma.$transaction([
    prisma.shop.update({
      where: { id: shop.id },
      data: { beansBalance: { decrement: amount } },
    }),
    prisma.walletCard.update({
      where: { id: card.id },
      data: { beansCount: { increment: amount } },
    }),
  ]);

  return NextResponse.json({ ok: true });
}

// Add beans to shop balance (purchase)
export async function PUT(req: NextRequest) {
  const shop = await getSession();
  if (!shop) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { amount } = await req.json();
  if (!amount || amount < 1) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  const updated = await prisma.shop.update({
    where: { id: shop.id },
    data: { beansBalance: { increment: amount } },
    select: { beansBalance: true },
  });

  return NextResponse.json(updated);
}
