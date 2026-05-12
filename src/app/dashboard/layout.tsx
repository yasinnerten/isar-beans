"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

interface Shop {
  id: string;
  name: string;
  email: string;
  beansBalance: number;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/shop/me")
      .then((r) => {
        if (r.status === 401) {
          router.push("/auth/login");
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (data) setShop(data);
      })
      .finally(() => setLoading(false));
  }, [router]);

  async function logout() {
    await fetch("/api/shop/logout", { method: "POST" });
    router.push("/auth/login");
  }

  const navItems = [
    { href: "/dashboard", label: "Overview", icon: "📊", exact: true },
    { href: "/dashboard/approvals", label: "Approvals", icon: "✅" },
    { href: "/dashboard/customers", label: "Customers", icon: "👥" },
    { href: "/dashboard/beans", label: "Buy Beans", icon: "🫘" },
    { href: "/dashboard/subscriptions", label: "Subscriptions", icon: "📅" },
    { href: "/dashboard/settings", label: "Settings", icon: "⚙️" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-coffee-50 flex items-center justify-center">
        <div className="text-coffee-900 text-xl">Loading... ☕</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-coffee-50 flex">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-coffee-100 bg-white">
        <div className="border-b border-coffee-100 p-5">
          <Link href="/" className="flex items-center gap-2">
            <img src="/grabthebeans-logo.png" alt="grabthebeans" className="h-8 w-8 object-contain" />
            <span className="font-bold tracking-tight text-coffee-900">grabthebeans</span>
          </Link>
          {shop && (
            <div className="mt-4">
              <p className="truncate text-sm font-semibold text-coffee-900">{shop.name}</p>
              <p className="truncate text-xs text-coffee-500">{shop.email}</p>
            </div>
          )}
        </div>

        {shop && (
          <div className="m-4 rounded-2xl border border-coffee-100 bg-sand p-4">
            <p className="text-3xl font-bold tracking-tight text-coffee-900">{shop.beansBalance}</p>
            <p className="mt-0.5 text-xs uppercase tracking-wider text-coffee-600">beans balance</p>
          </div>
        )}

        <nav className="flex-1 space-y-1 px-3">
          {navItems.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                  active
                    ? "bg-coffee-900 font-semibold text-cream"
                    : "text-coffee-700 hover:bg-sand"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-coffee-100 p-4">
          <button
            onClick={logout}
            className="w-full rounded-xl border border-coffee-200 px-3 py-2 text-left text-sm text-coffee-700 hover:bg-sand"
          >
            Sign out →
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-64 flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
