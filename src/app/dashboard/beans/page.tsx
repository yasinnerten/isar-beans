"use client";

import { useEffect, useState } from "react";

interface Shop {
  beansBalance: number;
  name: string;
}

const BEAN_PACKS = [
  { amount: 10, price: 5, label: "Espresso Pack" },
  { amount: 50, price: 20, label: "Cappuccino Pack" },
  { amount: 100, price: 35, label: "Barista Pack" },
  { amount: 250, price: 75, label: "Roaster Pack" },
];

export default function BeansPage() {
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  useEffect(() => {
    fetch("/api/shop/me").then((r) => r.json()).then(setShop);
  }, []);

  async function buyPack(amount: number) {
    setLoading(true);
    const res = await fetch("/api/shop/beans", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });
    if (res.ok) {
      const data = await res.json();
      setShop((s) => s ? { ...s, beansBalance: data.beansBalance } : s);
      showToast(`${amount} beans added to your balance! ☕`);
    } else {
      showToast("Failed to add beans", "error");
    }
    setLoading(false);
  }

  const stripeEnabled = typeof window !== "undefined";

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {toast && (
        <div className={`fixed top-6 right-6 z-50 rounded-xl px-6 py-3 text-sm font-medium text-white shadow-lg ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
          {toast.msg}
        </div>
      )}

      <h1 className="text-2xl font-bold tracking-tight text-coffee-900 sm:text-3xl">Buy Beans 🫘</h1>
      <p className="text-coffee-600">Top up your bean balance to reward customers</p>

      <div className="surface flex items-center gap-4 p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sand text-2xl">🫘</div>
        <div>
          <p className="text-3xl font-extrabold tracking-tight text-coffee-900">{shop?.beansBalance ?? "—"}</p>
          <p className="text-sm text-coffee-600">Current bean balance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {BEAN_PACKS.map((pack) => (
          <div key={pack.amount} className="surface surface-hover flex flex-col p-6">
            <p className="text-2xl">🫘</p>
            <h3 className="mt-2 text-base font-bold tracking-tight text-coffee-900">{pack.label}</h3>
            <p className="mt-1 text-sm text-coffee-600">{pack.amount} beans</p>
            <p className="mt-3 text-2xl font-bold tracking-tight text-coffee-900">€{pack.price}</p>
            <button
              disabled={loading}
              onClick={() => buyPack(pack.amount)}
              className="btn-primary mt-auto w-full"
            >
              {stripeEnabled ? "Buy now" : "Add (demo)"}
            </button>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-coffee-100 bg-sand p-4 text-sm text-coffee-700">
        ℹ️ In demo mode, beans are added directly to your balance.
        Connect Stripe in your <code className="bg-cream px-1 rounded">.env</code> file to enable real payments.
        For recurring beans, check out our <a href="/dashboard/subscriptions" className="font-semibold underline">subscription plans</a>.
      </div>
    </div>
  );
}
