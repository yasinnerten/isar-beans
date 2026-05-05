import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const shop = await getSession();
  if (!shop) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { approvalId, action } = await req.json();
  if (!approvalId || !["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const approval = await prisma.beanApproval.findUnique({
    where: { id: approvalId },
    include: { customer: true },
  });

  if (!approval || approval.shopId !== shop.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (approval.status !== "pending") {
    return NextResponse.json({ error: "Already processed" }, { status: 409 });
  }

  if (action === "reject") {
    await prisma.beanApproval.update({
      where: { id: approvalId },
      data: { status: "rejected" },
    });
    return NextResponse.json({ ok: true, status: "rejected" });
  }

  // Approve: add bean to wallet card
  const currentShop = await prisma.shop.findUnique({ where: { id: shop.id } });
  if (!currentShop || currentShop.beansBalance < approval.beansAmount) {
    return NextResponse.json({ error: "Insufficient beans balance" }, { status: 402 });
  }

  await prisma.$transaction(async (tx) => {
    // Deduct from shop balance
    await tx.shop.update({
      where: { id: shop.id },
      data: { beansBalance: { decrement: approval.beansAmount } },
    });

    // Find or create wallet card
    const existingCard = await tx.walletCard.findUnique({
      where: { shopId_customerId: { shopId: shop.id, customerId: approval.customerId } },
    });

    if (existingCard) {
      await tx.walletCard.update({
        where: { id: existingCard.id },
        data: { beansCount: { increment: approval.beansAmount } },
      });
    }

    await tx.beanApproval.update({
      where: { id: approvalId },
      data: { status: "approved" },
    });
  });

  return NextResponse.json({ ok: true, status: "approved" });
}
