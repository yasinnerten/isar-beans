"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", address: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/shop/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push("/dashboard");
    } else {
      const data = await res.json();
      setError(data.error || "Registration failed");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#fdf6ee] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="block mb-3"><img src="/grabthebeans-logo.png" alt="grabthebeans logo" className="h-12 w-auto mx-auto rounded" /></Link>
          <h1 className="text-2xl font-bold text-[#5c3316]">grabthebeans</h1>
          <p className="text-[#7d4a1e] mt-1">Register your coffee shop</p>
        </div>

        <div className="bean-card p-8">
          {/* Free beans highlight */}
          <div className="bg-amber-100 border-2 border-amber-300 rounded-xl p-4 mb-6 text-center">
            <div className="text-3xl mb-1">🎉</div>
            <p className="text-[#5c3316] font-semibold">Get 50 free beans when you sign up!</p>
            <p className="text-sm text-[#7d4a1e]">Start rewarding customers immediately.</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-5 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#5c3316] mb-1.5">
                Coffee shop name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full border-2 border-amber-200 rounded-lg px-4 py-3 text-[#3b1a08] focus:outline-none focus:border-amber-500 bg-white"
                placeholder="e.g. Café Isar"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5c3316] mb-1.5">
                Email address *
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full border-2 border-amber-200 rounded-lg px-4 py-3 text-[#3b1a08] focus:outline-none focus:border-amber-500 bg-white"
                placeholder="owner@yourcafe.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5c3316] mb-1.5">
                Password *
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={6}
                className="w-full border-2 border-amber-200 rounded-lg px-4 py-3 text-[#3b1a08] focus:outline-none focus:border-amber-500 bg-white"
                placeholder="Min. 6 characters"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5c3316] mb-1.5">
                Shop address (optional)
              </label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full border-2 border-amber-200 rounded-lg px-4 py-3 text-[#3b1a08] focus:outline-none focus:border-amber-500 bg-white"
                placeholder="e.g. Isartalstr. 7, Munich"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#5c3316] hover:bg-[#7d4a1e] disabled:opacity-60 text-white py-3 rounded-lg font-semibold transition-colors mt-2"
            >
              {loading ? "Creating account..." : "Create account + get 50 beans ☕"}
            </button>
          </form>

          <p className="text-center text-sm text-[#7d4a1e] mt-6">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-[#a0622a] hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
