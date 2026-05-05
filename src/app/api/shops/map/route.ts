import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const shops = await prisma.shop.findMany({
    where: {
      lat: { not: null },
      lng: { not: null },
    },
    select: {
      id: true,
      name: true,
      address: true,
      lat: true,
      lng: true,
      description: true,
      rewardThreshold: true,
    },
  });

  return NextResponse.json(shops);
}
