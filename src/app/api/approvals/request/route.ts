import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateUniqueCode } from "@/lib/wallet";

// Customer scans QR → calls this endpoint to request a bean
export async function POST(req: NextRequest) {
  const { shopId, customerName, customerEmail, deviceId } = await req.json();

  if (!shopId || !deviceId) {
    return NextResponse.json({ error: "Missing shopId or deviceId" }, { status: 400 });
  }

  const shop = await prisma.shop.findUnique({ where: { id: shopId } });
  if (!shop) {
    return NextResponse.json({ error: "Shop not found" }, { status: 404 });
  }

  // Find or create customer
  let customer = await prisma.customer.findUnique({ where: { deviceId } });
  if (!customer) {
    customer = await prisma.customer.create({
      data: {
        deviceId,
        name: customerName || null,
        email: customerEmail || null,
      },
    });
  }

  // Find or create wallet card for this shop+customer
  let walletCard = await prisma.walletCard.findUnique({
    where: { shopId_customerId: { shopId, customerId: customer.id } },
  });

  if (!walletCard) {
    walletCard = await prisma.walletCard.create({
      data: {
        shopId,
        customerId: customer.id,
        uniqueCode: generateUniqueCode(),
        beansCount: 0,
      },
    });
  }

  // Check for duplicate pending request
  const pending = await prisma.beanApproval.findFirst({
    where: { shopId, customerId: customer.id, status: "pending" },
  });

  if (pending) {
    return NextResponse.json({
      ok: true,
      alreadyPending: true,
      uniqueCode: walletCard.uniqueCode,
      walletCardId: walletCard.id,
      shopName: shop.name,
      beansCount: walletCard.beansCount,
      rewardThreshold: shop.rewardThreshold,
    });
  }

  // Create approval request
  await prisma.beanApproval.create({
    data: {
      shopId,
      customerId: customer.id,
      uniqueCode: walletCard.uniqueCode,
      beansAmount: 1,
      status: "pending",
    },
  });

  return NextResponse.json({
    ok: true,
    uniqueCode: walletCard.uniqueCode,
    walletCardId: walletCard.id,
    shopName: shop.name,
    beansCount: walletCard.beansCount,
    rewardThreshold: shop.rewardThreshold,
  });
}
