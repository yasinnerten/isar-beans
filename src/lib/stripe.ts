import Stripe from "stripe";

let stripe: Stripe | null = null;

if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-04-22.dahlia",
  });
}

export { stripe };

export const PLANS = {
  starter: {
    name: "Starter",
    beansPerDay: 50,
    priceEur: 50,
    description: "50 beans per day for your customers",
    stripePriceId: process.env.STRIPE_PRICE_STARTER,
  },
  pro: {
    name: "Pro",
    beansPerDay: 100,
    priceEur: 100,
    description: "100 beans per day for your customers",
    stripePriceId: process.env.STRIPE_PRICE_PRO,
  },
} as const;

export type PlanKey = keyof typeof PLANS;
