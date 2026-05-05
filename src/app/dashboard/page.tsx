"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Shop {
  id: string;
  name: string;
  beansBalance: number;
  rewardThreshold: number;
}

interface Approval {
  id: string;
  uniqueCode: string;
  createdAt: string;
  customer: { name: string | null; email: string | null; deviceId: string | null };
}

interface WalletCard {
  id: string;
  beansCount: number;
  uniqueCode: string;
  updatedAt: string;
  customer: { name: string | null; email: string | null };
}

export default function DashboardPage() {
  const [shop, setShop] = useState<Shop | null>(null);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [cards, setCards] = useState<WalletCard[]>([]);
  const [qr, setQr] = useState<{ qr: string; url: string } | null>(null);

  useEffect(() => {
    fetch("/api/shop/me").then((r) => r.json()).then(setShop);
    fetch("/api/approvals/pending").then((r) => r.json()).then(setApprovals);
    fetch("/api/shop/customers").then((r) => r.json()).then(setCards);
    fetch("/api/shop/qr").then((r) => r.json()).then(setQr);
  }, []);

  async function handleApproval(approvalId: string, action: "approve" | "reject") {
    const res = await fetch("/api/approvals/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approvalId, action }),
    });
    if (res.ok) {
      setApprovals((prev) => prev.filter((a) => a.id !== approvalId));
      if (action === "approve") {
        fetch("/api/shop/me").then((r) => r.json()).then(setShop);
        fetch("/api/shop/customers").then((r) => r.json()).then(setCards);
      }
    }
  }

  const recentCards = cards.slice(0, 5);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#5c3316]">
            Good morning{shop ? `, ${shop.name}` : ""} ☕
          </h1>
          <p className="text-[#7d4a1e] mt-1">Welcome to your Isar Beans dashboard</p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bean-card p-6">
          <div className="text-4xl mb-2">🫘</div>
          <div className="text-3xl font-bold text-[#5c3316]">{shop?.beansBalance ?? "—"}</div>
          <div className="text-[#7d4a1e] text-sm mt-1">Beans balance</div>
          <Link href="/dashboard/beans" className="text-amber-600 text-sm hover:underline mt-2 inline-block">
            Buy more →
          </Link>
        </div>
        <div className="bean-card p-6">
          <div className="text-4xl mb-2">✅</div>
          <div className="text-3xl font-bold text-[#5c3316]">{approvals.length}</div>
          <div className="text-[#7d4a1e] text-sm mt-1">Pending approvals</div>
          {approvals.length > 0 && (
            <Link href="/dashboard/approvals" className="text-amber-600 text-sm hover:underline mt-2 inline-block">
              Review now →
            </Link>
          )}
        </div>
        <div className="bean-card p-6">
          <div className="text-4xl mb-2">👥</div>
          <div className="text-3xl font-bold text-[#5c3316]">{cards.length}</div>
          <div className="text-[#7d4a1e] text-sm mt-1">Loyal customers</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* QR Code */}
        <div className="bean-card p-6">
          <h2 className="text-lg font-bold text-[#5c3316] mb-4">📲 Your Shop QR Code</h2>
          <p className="text-sm text-[#7d4a1e] mb-4">
            Print or display this QR code in your shop. Customers scan it to collect beans.
          </p>
          {qr ? (
            <div className="text-center">
              <img src={qr.qr} alt="Shop QR Code" className="mx-auto rounded-xl border-2 border-amber-200" style={{ width: 200 }} />
              <p className="text-xs text-gray-500 mt-2 break-all">{qr.url}</p>
            </div>
          ) : (
            <div className="h-48 bg-amber-50 rounded-xl animate-pulse" />
          )}
        </div>

        {/* Pending approvals */}
        <div className="bean-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#5c3316]">⏳ Pending Approvals</h2>
            <Link href="/dashboard/approvals" className="text-sm text-amber-600 hover:underline">
              View all
            </Link>
          </div>
          {approvals.length === 0 ? (
            <div className="text-center py-8 text-[#7d4a1e]">
              <div className="text-4xl mb-2">✨</div>
              <p className="text-sm">No pending approvals. All caught up!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {approvals.slice(0, 3).map((a) => (
                <div key={a.id} className="flex items-center justify-between bg-amber-50 rounded-xl p-3">
                  <div>
                    <p className="font-mono text-sm font-medium text-[#5c3316]">{a.uniqueCode}</p>
                    <p className="text-xs text-gray-500">{a.customer.name || a.customer.deviceId || "Anonymous"}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApproval(a.id, "approve")}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => handleApproval(a.id, "reject")}
                      className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                    >
                      ✗
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent customers */}
      {recentCards.length > 0 && (
        <div className="bean-card p-6 mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#5c3316]">🧾 Recent Customer Activity</h2>
            <Link href="/dashboard/customers" className="text-sm text-amber-600 hover:underline">
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#7d4a1e] border-b border-amber-200">
                  <th className="pb-2 pr-4">Customer</th>
                  <th className="pb-2 pr-4">Beans</th>
                  <th className="pb-2 pr-4">Progress</th>
                  <th className="pb-2">Code</th>
                </tr>
              </thead>
              <tbody>
                {recentCards.map((c) => {
                  const pct = shop ? Math.min(100, Math.round((c.beansCount / shop.rewardThreshold) * 100)) : 0;
                  return (
                    <tr key={c.id} className="border-b border-amber-50 hover:bg-amber-50">
                      <td className="py-2 pr-4 text-[#3b1a08]">
                        {c.customer.name || c.customer.email || "Anonymous"}
                      </td>
                      <td className="py-2 pr-4 font-bold text-[#5c3316]">
                        {c.beansCount} / {shop?.rewardThreshold || "?"}
                      </td>
                      <td className="py-2 pr-4">
                        <div className="w-24 bg-amber-100 rounded-full h-2">
                          <div
                            className="bg-amber-500 rounded-full h-2"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-2 font-mono text-xs text-gray-500">{c.uniqueCode}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
