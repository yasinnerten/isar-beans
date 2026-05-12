"use client";

import { useState } from "react";

const PLANS = [
  {
    key: "starter",
    name: "Starter",
    icon: "☕",
    beansPerDay: 50,
    priceEur: 50,
    description: "Perfect for small cafés",
    features: ["50 beans per day", "Customer loyalty tracking", "Apple Wallet integration", "Email support"],
  },
  {
    key: "pro",
    name: "Pro",
    icon: "🫘",
    beansPerDay: 100,
    priceEur: 100,
    description: "For busy coffee shops",
    features: ["100 beans per day", "Customer loyalty tracking", "Apple Wallet integration", "Priority support", "Advanced analytics"],
    popular: true,
  },
];

export default function SubscriptionsPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  }

  async function subscribe(planKey: string) {
    setLoading(planKey);
    const res = await fetch("/api/subscriptions/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: planKey }),
    });
    const data = await res.json();
    if (res.ok) {
      if (data.url) {
        window.location.href = data.url;
      } else {
        showToast("Subscription activated (demo mode)! 🎉");
      }
    } else {
      showToast(data.error || "Failed to subscribe", "error");
    }
    setLoading(null);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {toast && (
        <div className={`fixed top-6 right-6 z-50 rounded-xl px-6 py-3 text-sm font-medium text-white shadow-lg ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
          {toast.msg}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-coffee-900 sm:text-3xl">Subscriptions 📅</h1>
        <p className="mt-1 text-coffee-600">Get a daily bean allowance for your customers</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {PLANS.map((plan) => (
          <div
            key={plan.key}
            className={`surface p-8 relative ${plan.popular ? "ring-2 ring-coffee-900" : ""}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-coffee-900 px-4 py-1 text-xs font-semibold text-cream">
                Most Popular
              </div>
            )}
            <div className="text-4xl mb-3">{plan.icon}</div>
            <h2 className="text-xl font-bold text-coffee-900">{plan.name}</h2>
            <p className="text-sm text-coffee-600 mb-4">{plan.description}</p>
            <div className="mb-6 flex items-baseline gap-1">
              <span className="text-4xl font-bold text-coffee-900">€{plan.priceEur}</span>
              <span className="text-coffee-600">/ month</span>
            </div>
            <ul className="mb-8 space-y-2">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-coffee-800">
                  <span className="text-coffee-500 font-bold">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <button
              disabled={loading === plan.key}
              onClick={() => subscribe(plan.key)}
              className={`w-full rounded-full py-3 font-semibold transition-colors ${
                plan.popular
                  ? "bg-coffee-900 text-cream hover:bg-coffee-800"
                  : "border border-coffee-900 text-coffee-900 hover:bg-coffee-900 hover:text-cream"
              } disabled:opacity-50`}
            >
              {loading === plan.key ? "Processing..." : `Subscribe to ${plan.name}`}
            </button>
          </div>
        ))}
      </div>

      <div className="surface bg-sand p-6">
        <p className="text-sm text-coffee-700">
          <span className="font-semibold text-coffee-900">💳 Stripe integration:</span> Add your{" "}
          <code className="bg-cream px-1 rounded">STRIPE_SECRET_KEY</code> to{" "}
          <code className="bg-cream px-1 rounded">.env</code> to enable real payment processing.
          Without it, subscriptions work in demo mode.
        </p>
      </div>
    </div>
  );
}
