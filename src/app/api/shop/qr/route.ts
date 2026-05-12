import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import QRCode from "qrcode";

export async function GET() {
  const shop = await getSession();
  if (!shop) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = `${process.env.NEXTAUTH_URL || "http://localhost:3002"}/scan?shop=${shop.id}`;
  const qrDataUrl = await QRCode.toDataURL(url, {
    color: { dark: "#5c3316", light: "#fdf6ee" },
    width: 300,
    margin: 2,
  });

  return NextResponse.json({ qr: qrDataUrl, url });
}
