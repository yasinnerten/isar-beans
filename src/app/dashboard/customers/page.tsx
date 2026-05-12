"use client";

import { useEffect, useState } from "react";
import { ProgressBar } from "@/components/ProgressBar";

interface WalletCard {
  id: string;
  beansCount: number;
  uniqueCode: string;
  updatedAt: string;
  createdAt: string;
  customer: { id: string; name: string | null; email: string | null; deviceId: string | null };
}

interface Shop {
  rewardThreshold: number;
  beansBalance: number;
}

export default function CustomersPage() {
  const [cards, setCards] = useState<WalletCard[]>([]);
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [giftAmounts, setGiftAmounts] = useState<Record<string, number>>({});
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  useEffect(() => {
    Promise.all([
      fetch("/api/shop/customers").then((r) => r.json()),
      fetch("/api/shop/me").then((r) => r.json()),
    ]).then(([c, s]) => {
      setCards(c);
      setShop(s);
    }).finally(() => setLoading(false));
  }, []);

  async function giftBeans(customerId: string, cardId: string) {
    const amount = giftAmounts[customerId] || 1;
    const res = await fetch("/api/shop/beans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerId, amount }),
    });
    if (res.ok) {
      setCards((prev) =>
        prev.map((c) =>
          c.id === cardId ? { ...c, beansCount: c.beansCount + amount } : c
        )
      );
      setShop((s) => s ? { ...s, beansBalance: s.beansBalance - amount } : s);
      showToast(`${amount} bean${amount > 1 ? "s" : ""} gifted! ☕`);
    } else {
      const data = await res.json();
      showToast(data.error || "Error gifting beans");
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {toast && (
        <div className="fixed top-6 right-6 z-50 rounded-xl bg-green-600 px-6 py-3 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-coffee-900 sm:text-3xl">Customers 👥</h1>
        <p className="mt-1 text-coffee-600">All customers who have collected beans at your shop</p>
      </div>

      {loading ? (
        <div className="text-coffee-600">Loading... ☕</div>
      ) : cards.length === 0 ? (
        <div className="surface p-12 text-center">
          <div className="text-5xl mb-4">☕</div>
          <h2 className="text-xl font-bold text-coffee-900 mb-2">No customers yet</h2>
          <p className="text-coffee-600">Share your QR code to get customers collecting beans!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {cards.map((card) => {
            const pct = shop
              ? Math.min(100, Math.round((card.beansCount / shop.rewardThreshold) * 100))
              : 0;
            return (
              <div key={card.id} className="surface p-6">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sand text-lg font-bold text-coffee-700">
                      {(card.customer.name || card.customer.email || "A")[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-coffee-900">
                        {card.customer.name || card.customer.email || "Anonymous"}
                      </p>
                      <p className="text-xs text-coffee-500 font-mono">{card.uniqueCode}</p>
                      <div className="mt-1.5 flex items-center gap-3">
                        <span className="text-sm font-medium text-coffee-900">
                          {card.beansCount} / {shop?.rewardThreshold || "?"} beans
                        </span>
                        <div className="w-24">
                          <ProgressBar value={card.beansCount} max={shop?.rewardThreshold || 1} />
                        </div>
                        <span className="text-xs text-coffee-600">{pct}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={giftAmounts[card.customer.id] || 1}
                      onChange={(e) =>
                        setGiftAmounts((prev) => ({
                          ...prev,
                          [card.customer.id]: parseInt(e.target.value) || 1,
                        }))
                      }
                      className="w-16 rounded-xl border border-coffee-200 px-2 py-1.5 text-center text-sm focus:border-coffee-500 focus:outline-none"
                    />
                    <button
                      onClick={() => giftBeans(card.customer.id, card.id)}
                      className="rounded-full bg-coffee-900 px-4 py-1.5 text-sm font-semibold text-cream hover:bg-coffee-800"
                    >
                      🫘 Gift beans
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
