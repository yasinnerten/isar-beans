import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const shop = await getSession();
  if (!shop) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const full = await prisma.shop.findUnique({
    where: { id: shop.id },
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      lat: true,
      lng: true,
      logoUrl: true,
      beansBalance: true,
      rewardThreshold: true,
      description: true,
      createdAt: true,
    },
  });

  return NextResponse.json(full);
}

export async function PATCH(req: Request) {
  const shop = await getSession();
  if (!shop) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, address, lat, lng, rewardThreshold, description } = body;

  const updated = await prisma.shop.update({
    where: { id: shop.id },
    data: {
      ...(name && { name }),
      ...(address !== undefined && { address }),
      ...(lat !== undefined && { lat: parseFloat(lat) }),
      ...(lng !== undefined && { lng: parseFloat(lng) }),
      ...(rewardThreshold !== undefined && { rewardThreshold: parseInt(rewardThreshold) }),
      ...(description !== undefined && { description }),
    },
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      lat: true,
      lng: true,
      beansBalance: true,
      rewardThreshold: true,
      description: true,
    },
  });

  return NextResponse.json(updated);
}
