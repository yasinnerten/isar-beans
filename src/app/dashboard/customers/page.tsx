"use client";

import { useEffect, useState } from "react";

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
    <div>
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg text-sm font-medium">
          {toast}
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#5c3316]">Customers 👥</h1>
        <p className="text-[#7d4a1e] mt-1">All customers who have collected beans at your shop</p>
      </div>

      {loading ? (
        <div className="text-[#7d4a1e]">Loading... ☕</div>
      ) : cards.length === 0 ? (
        <div className="bean-card p-12 text-center">
          <div className="text-5xl mb-4">☕</div>
          <h2 className="text-xl font-bold text-[#5c3316] mb-2">No customers yet</h2>
          <p className="text-[#7d4a1e]">Share your QR code to get customers collecting beans!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {cards.map((card) => {
            const pct = shop
              ? Math.min(100, Math.round((card.beansCount / shop.rewardThreshold) * 100))
              : 0;
            return (
              <div key={card.id} className="bean-card p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-amber-100 rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold text-amber-700">
                      {(card.customer.name || card.customer.email || "A")[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-[#3b1a08]">
                        {card.customer.name || card.customer.email || "Anonymous"}
                      </p>
                      <p className="text-xs text-gray-400 font-mono">{card.uniqueCode}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-sm text-[#5c3316] font-medium">
                          {card.beansCount} / {shop?.rewardThreshold || "?"} beans
                        </span>
                        <div className="w-24 bg-amber-100 rounded-full h-2">
                          <div className="bg-amber-500 rounded-full h-2" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-amber-600">{pct}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Gift beans */}
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
                      className="w-16 border-2 border-amber-200 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:border-amber-500"
                    />
                    <button
                      onClick={() => giftBeans(card.customer.id, card.id)}
                      className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
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
