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
    { href: "/dashboard", label: "Overview", icon: "📊" },
    { href: "/dashboard/approvals", label: "Approvals", icon: "✅" },
    { href: "/dashboard/customers", label: "Customers", icon: "👥" },
    { href: "/dashboard/beans", label: "Buy Beans", icon: "🫘" },
    { href: "/dashboard/subscriptions", label: "Subscriptions", icon: "📅" },
    { href: "/dashboard/settings", label: "Settings", icon: "⚙️" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdf6ee] flex items-center justify-center">
        <div className="text-[#5c3316] text-xl">Loading... ☕</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf6ee] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#5c3316] text-white flex flex-col fixed h-full z-40">
        <div className="p-6 border-b border-[#7d4a1e]">
          <Link href="/" className="flex items-center gap-2">
            <img src="/grabthebeans-logo.png" alt="grabthebeans logo" className="h-7 w-auto rounded" />
            <span className="font-bold text-lg">grabthebeans</span>
          </Link>
          {shop && (
            <div className="mt-3">
              <p className="text-sm text-amber-200 truncate font-medium">{shop.name}</p>
              <p className="text-xs text-amber-400 truncate">{shop.email}</p>
            </div>
          )}
        </div>

        {/* Bean balance chip */}
        {shop && (
          <div className="px-6 py-4 border-b border-[#7d4a1e]">
            <div className="bg-amber-800 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-amber-300">{shop.beansBalance}</div>
              <div className="text-xs text-amber-400 mt-0.5">beans balance</div>
            </div>
          </div>
        )}

        <nav className="flex-1 py-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                pathname === item.href
                  ? "bg-[#7d4a1e] text-white font-semibold"
                  : "text-amber-200 hover:bg-[#7d4a1e] hover:text-white"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-[#7d4a1e]">
          <button
            onClick={logout}
            className="w-full text-amber-300 hover:text-white text-sm py-2 transition-colors"
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
