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
        window.location.href = data.url; // Stripe checkout
      } else {
        showToast("Subscription activated (demo mode)! 🎉");
      }
    } else {
      showToast(data.error || "Failed to subscribe", "error");
    }
    setLoading(null);
  }

  return (
    <div>
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.msg}
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#5c3316]">Subscriptions 📅</h1>
        <p className="text-[#7d4a1e] mt-1">Get a daily bean allowance for your customers</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-3xl">
        {PLANS.map((plan) => (
          <div
            key={plan.key}
            className={`bean-card p-8 relative ${plan.popular ? "border-[#a0622a] shadow-xl" : ""}`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#5c3316] text-white text-xs px-4 py-1.5 rounded-full font-semibold">
                Most Popular
              </div>
            )}
            <div className="text-4xl mb-3">{plan.icon}</div>
            <h2 className="text-xl font-bold text-[#5c3316]">{plan.name}</h2>
            <p className="text-sm text-[#7d4a1e] mb-4">{plan.description}</p>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold text-amber-700">€{plan.priceEur}</span>
              <span className="text-[#7d4a1e]">/ month</span>
            </div>
            <ul className="space-y-2 mb-8">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-[#5c3316]">
                  <span className="text-green-500 font-bold">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <button
              disabled={loading === plan.key}
              onClick={() => subscribe(plan.key)}
              className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                plan.popular
                  ? "bg-[#5c3316] hover:bg-[#7d4a1e] text-white"
                  : "border-2 border-[#5c3316] text-[#5c3316] hover:bg-[#5c3316] hover:text-white"
              } disabled:opacity-50`}
            >
              {loading === plan.key ? "Processing..." : `Subscribe to ${plan.name}`}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 bean-card p-6 bg-amber-50 max-w-3xl">
        <p className="text-sm text-[#7d4a1e]">
          <span className="font-semibold text-[#5c3316]">💳 Stripe integration:</span> Add your{" "}
          <code className="bg-amber-100 px-1 rounded">STRIPE_SECRET_KEY</code> to{" "}
          <code className="bg-amber-100 px-1 rounded">.env</code> to enable real payment processing.
          Without it, subscriptions work in demo mode.
        </p>
      </div>
    </div>
  );
}
