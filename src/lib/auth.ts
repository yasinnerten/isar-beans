import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "./db";

const SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "isar-beans-super-secret-change-in-production"
);

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createToken(shopId: string) {
  return new SignJWT({ shopId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(SECRET);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as { shopId: string };
  } catch {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("isar-session")?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload) return null;
  const shop = await prisma.shop.findUnique({ where: { id: payload.shopId } });
  return shop;
}

export async function setSession(shopId: string) {
  const token = await createToken(shopId);
  const cookieStore = await cookies();
  cookieStore.set("isar-session", token, {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete("isar-session");
}
