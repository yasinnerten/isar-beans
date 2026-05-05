import { NextRequest, NextResponse } from "next/server";
import { stripe, PLANS } from "@/lib/stripe";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const shop = await getSession();
  if (!shop) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { plan } = await req.json();
  const planData = PLANS[plan as keyof typeof PLANS];

  if (!planData) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  if (stripe && planData.stripePriceId) {
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: planData.stripePriceId, quantity: 1 }],
      success_url: `${process.env.NEXTAUTH_URL}/dashboard/subscriptions?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/dashboard/subscriptions?canceled=true`,
      metadata: { shopId: shop.id, plan },
    });
    return NextResponse.json({ url: session.url });
  }

  // No Stripe configured – activate plan directly (demo mode)
  const subscription = await prisma.subscription.create({
    data: {
      shopId: shop.id,
      plan,
      beansPerDay: planData.beansPerDay,
      priceEur: planData.priceEur,
      status: "active",
    },
  });

  return NextResponse.json({ subscription, demo: true });
}
