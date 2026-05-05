import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const body = await req.text();
  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Webhook error: ${msg}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { shopId, plan } = session.metadata || {};

    if (shopId && plan) {
      const planMap: Record<string, { beansPerDay: number; priceEur: number }> = {
        starter: { beansPerDay: 50, priceEur: 50 },
        pro: { beansPerDay: 100, priceEur: 100 },
      };
      const planData = planMap[plan];
      if (planData) {
        await prisma.subscription.create({
          data: {
            shopId,
            plan,
            beansPerDay: planData.beansPerDay,
            priceEur: planData.priceEur,
            stripeSubId: session.subscription as string,
            status: "active",
          },
        });
      }
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object;
    await prisma.subscription.updateMany({
      where: { stripeSubId: sub.id },
      data: { status: "cancelled" },
    });
  }

  return NextResponse.json({ received: true });
}
