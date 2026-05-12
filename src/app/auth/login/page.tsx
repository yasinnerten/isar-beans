"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/shop/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push("/dashboard");
    } else {
      const data = await res.json();
      setError(data.error || "Login failed");
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-4 py-10">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 flex flex-col items-center">
          <img src="/grabthebeans-logo.png" alt="grabthebeans" className="h-12 w-12 object-contain" />
          <span className="mt-3 text-lg font-bold tracking-tight text-coffee-900">grabthebeans</span>
          <span className="text-sm text-coffee-600">Coffee shop login</span>
        </Link>

        <div className="surface p-7">
          <h2 className="mb-5 text-center text-lg font-bold tracking-tight text-coffee-900">
            Sign in to your dashboard
          </h2>

          {error && (
            <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-coffee-700">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="gtb-input"
                placeholder="you@yourcafe.com"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-coffee-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="gtb-input"
                placeholder="••••••••"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Signing in..." : "Sign in ☕"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-coffee-600">
            No account yet?{" "}
            <Link href="/auth/register" className="font-semibold text-coffee-900 hover:underline">
              Register your shop
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
