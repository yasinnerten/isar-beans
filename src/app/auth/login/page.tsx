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
    <div className="min-h-screen bg-[#fdf6ee] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="block mb-3"><img src="/grabthebeans-logo.png" alt="grabthebeans logo" className="h-12 w-auto mx-auto rounded" /></Link>
          <h1 className="text-2xl font-bold text-[#5c3316]">grabthebeans</h1>
          <p className="text-[#7d4a1e] mt-1">Coffee shop login</p>
        </div>

        <div className="bean-card p-8">
          <h2 className="text-xl font-bold text-[#5c3316] mb-6 text-center">
            Sign in to your dashboard
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-5 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#5c3316] mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border-2 border-amber-200 rounded-lg px-4 py-3 text-[#3b1a08] focus:outline-none focus:border-amber-500 bg-white"
                placeholder="you@yourcafe.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5c3316] mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border-2 border-amber-200 rounded-lg px-4 py-3 text-[#3b1a08] focus:outline-none focus:border-amber-500 bg-white"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#5c3316] hover:bg-[#7d4a1e] disabled:opacity-60 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              {loading ? "Signing in..." : "Sign in ☕"}
            </button>
          </form>

          <p className="text-center text-sm text-[#7d4a1e] mt-6">
            No account yet?{" "}
            <Link href="/auth/register" className="text-[#a0622a] hover:underline font-medium">
              Register your shop
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
