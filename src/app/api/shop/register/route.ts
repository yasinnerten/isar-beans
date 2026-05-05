import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, setSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, password, address } = body;

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const existing = await prisma.shop.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const shop = await prisma.shop.create({
    data: {
      name,
      email,
      passwordHash,
      address: address || null,
      beansBalance: 50, // 50 free beans on signup
    },
  });

  await setSession(shop.id);
  return NextResponse.json({ id: shop.id, name: shop.name, email: shop.email });
}
