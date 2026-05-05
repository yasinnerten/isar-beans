import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generatePassBuffer, buildPassJson } from "@/lib/wallet";

// GET /api/wallet/pass?cardId=xxx
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cardId = searchParams.get("cardId");

  if (!cardId) {
    return NextResponse.json({ error: "Missing cardId" }, { status: 400 });
  }

  const card = await prisma.walletCard.findUnique({
    where: { id: cardId },
    include: { shop: true, customer: true },
  });

  if (!card) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  const passData = {
    serialNumber: card.serialNumber,
    authToken: card.authToken,
    shopName: card.shop.name,
    beansCount: card.beansCount,
    rewardThreshold: card.shop.rewardThreshold,
    uniqueCode: card.uniqueCode,
    passTypeId: card.passTypeId,
    customerId: card.customerId,
  };

  const hasAppleCerts =
    process.env.APPLE_WWDR_CERT &&
    process.env.APPLE_PASS_CERT &&
    process.env.APPLE_PASS_KEY;

  if (hasAppleCerts) {
    const buffer = await generatePassBuffer(passData);
    if (buffer) {
      return new NextResponse(buffer as unknown as BodyInit, {
        headers: {
          "Content-Type": "application/vnd.apple.pkpass",
          "Content-Disposition": `attachment; filename="isarbeans-${card.shop.name}.pkpass"`,
        },
      });
    }
  }

  // Fallback: return pass JSON for demo
  const passJson = buildPassJson(passData);
  return NextResponse.json({
    pass: passJson,
    demo: true,
    message: "Apple certificates not configured. Showing pass data for demo purposes.",
  });
}
