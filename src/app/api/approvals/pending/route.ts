import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const shop = await getSession();
  if (!shop) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const approvals = await prisma.beanApproval.findMany({
    where: { shopId: shop.id, status: "pending" },
    include: { customer: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(approvals);
}
