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

  const stripeEnabled = typeof window !== "undefined"; // We'd check from API

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
        <h1 className="text-2xl font-bold text-[#5c3316]">Buy Beans 🫘</h1>
        <p className="text-[#7d4a1e] mt-1">Top up your bean balance to reward customers</p>
      </div>

      {/* Current balance */}
      <div className="bean-card p-6 mb-8 flex items-center gap-6">
        <div className="bg-amber-100 rounded-2xl p-4 text-center">
          <div className="text-3xl">🫘</div>
        </div>
        <div>
          <p className="text-sm text-[#7d4a1e]">Current bean balance</p>
          <p className="text-4xl font-bold text-[#5c3316]">{shop?.beansBalance ?? "—"}</p>
          <p className="text-xs text-gray-500 mt-0.5">beans available to give to customers</p>
        </div>
      </div>

      {/* Bean packs */}
      <h2 className="text-lg font-bold text-[#5c3316] mb-4">One-time bean packs</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {BEAN_PACKS.map((pack) => (
          <div key={pack.amount} className="bean-card p-6 text-center hover:border-amber-400 transition-colors">
            <div className="text-3xl mb-2">🫘</div>
            <h3 className="font-bold text-[#5c3316]">{pack.label}</h3>
            <p className="text-3xl font-bold text-amber-700 my-2">{pack.amount}</p>
            <p className="text-sm text-[#7d4a1e] mb-4">beans</p>
            <p className="text-lg font-bold text-[#5c3316] mb-4">€{pack.price}</p>
            <button
              disabled={loading}
              onClick={() => buyPack(pack.amount)}
              className="w-full bg-[#5c3316] hover:bg-[#7d4a1e] disabled:opacity-50 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors"
            >
              {stripeEnabled ? "Buy now" : "Add (demo)"}
            </button>
          </div>
        ))}
      </div>

      <div className="bean-card p-6 bg-amber-50">
        <p className="text-sm text-[#7d4a1e]">
          <span className="font-semibold text-[#5c3316]">💡 Note:</span> In demo mode, beans are added directly to your balance.
          Connect Stripe in your <code className="bg-amber-100 px-1 rounded">.env</code> file to enable real payments.
          For recurring beans, check out our{" "}
          <a href="/dashboard/subscriptions" className="text-amber-600 hover:underline">subscription plans</a>.
        </p>
      </div>
    </div>
  );
}
