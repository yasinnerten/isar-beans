"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ProgressBar } from "@/components/ProgressBar";

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
    <div className="mx-auto max-w-6xl space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-coffee-900 sm:text-3xl">
        Good morning{shop ? `, ${shop.name}` : ""} ☕
      </h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard icon="🫘" label="Beans balance" value={shop?.beansBalance ?? 0} link={{ href: "/dashboard/beans", label: "Buy more →" }} />
        <StatCard icon="✅" label="Pending approvals" value={approvals.length} link={approvals.length > 0 ? { href: "/dashboard/approvals", label: "Review now →" } : undefined} />
        <StatCard icon="👥" label="Loyal customers" value={cards.length} link={{ href: "/dashboard/customers", label: "View all →" }} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="surface p-6">
          <h2 className="text-lg font-bold tracking-tight text-coffee-900">Your Shop QR Code</h2>
          <p className="mt-1 text-sm text-coffee-600">Print or display this QR code in your shop. Customers scan it to collect beans.</p>
          <div className="mt-5 flex flex-col items-center">
            {qr ? (
              <>
                <img src={qr.qr} alt="Shop QR Code" width={200} height={200} className="rounded-xl border border-coffee-200" />
                <p className="mt-3 break-all text-center text-xs text-coffee-500">{qr.url}</p>
              </>
            ) : (
              <div className="flex h-[200px] w-[200px] animate-pulse items-center justify-center rounded-xl border border-coffee-200 bg-sand">
                <span className="text-xs text-coffee-600">Loading QR... ☕</span>
              </div>
            )}
          </div>
        </div>

        <div className="surface p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight text-coffee-900">Pending Approvals</h2>
            <Link href="/dashboard/approvals" className="text-sm font-semibold text-coffee-800 hover:text-coffee-900">View all</Link>
          </div>
          {approvals.length === 0 ? (
            <p className="py-10 text-center text-coffee-500">No pending approvals. All caught up!</p>
          ) : (
            <ul className="space-y-2">
              {approvals.slice(0, 3).map((a) => (
                <li key={a.id} className="flex items-center gap-3 rounded-xl border border-coffee-100 p-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-mono text-sm font-semibold text-coffee-900">{a.uniqueCode}</p>
                    <p className="text-xs text-coffee-500">{a.customer.name || a.customer.deviceId || "Anonymous"}</p>
                  </div>
                  <button
                    onClick={() => handleApproval(a.id, "approve")}
                    className="rounded-full bg-coffee-900 px-3 py-1.5 text-sm font-semibold text-cream hover:bg-coffee-800"
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => handleApproval(a.id, "reject")}
                    className="rounded-full border border-coffee-200 px-3 py-1.5 text-sm font-semibold text-coffee-700 hover:bg-sand"
                  >
                    ✗
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {recentCards.length > 0 && (
        <div className="surface p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight text-coffee-900">Recent Customer Activity</h2>
            <Link href="/dashboard/customers" className="text-sm font-semibold text-coffee-800 hover:text-coffee-900">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wider text-coffee-500">
                <tr>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Beans</th>
                  <th className="pb-3 font-semibold">Progress</th>
                  <th className="pb-3 font-semibold">Code</th>
                </tr>
              </thead>
              <tbody>
                {recentCards.map((c) => (
                  <tr key={c.id} className="border-t border-coffee-100">
                    <td className="py-3 font-semibold text-coffee-900">{c.customer.name || c.customer.email || "Anonymous"}</td>
                    <td className="py-3 text-coffee-700">{c.beansCount} / {shop?.rewardThreshold ?? "?"}</td>
                    <td className="py-3"><div className="w-24"><ProgressBar value={c.beansCount} max={shop?.rewardThreshold ?? 1} /></div></td>
                    <td className="py-3 font-mono text-xs text-coffee-600">{c.uniqueCode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon, label, value, link,
}: {
  icon: string; label: string; value: number;
  link?: { href: string; label: string };
}) {
  return (
    <div className="surface surface-hover p-6">
      <div className="flex items-center justify-between">
        <span className="text-xl">{icon}</span>
        <p className="text-3xl font-extrabold tracking-tight text-coffee-900">{value}</p>
      </div>
      <p className="mt-2 text-xs uppercase tracking-wider text-coffee-500">{label}</p>
      {link && (
        <Link href={link.href} className="mt-3 inline-block text-sm font-semibold text-coffee-800 hover:text-coffee-900">
          {link.label}
        </Link>
      )}
    </div>
  );
}
