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
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-4 py-10">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 flex flex-col items-center">
          <img src="/grabthebeans-logo.png" alt="grabthebeans" className="h-12 w-12 object-contain" />
          <span className="mt-3 text-lg font-bold tracking-tight text-coffee-900">grabthebeans</span>
          <span className="text-sm text-coffee-600">Register your coffee shop</span>
        </Link>

        <div className="surface p-7">
          <div className="mb-5 rounded-xl bg-sand px-3 py-2.5 text-center text-sm font-semibold text-coffee-800">
            🎉 Get 50 free beans when you sign up!
          </div>

          {error && (
            <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-coffee-700">Coffee shop name *</span>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="gtb-input"
                placeholder="e.g. Café Isar"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-coffee-700">Email address *</span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="gtb-input"
                placeholder="owner@yourcafe.com"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-coffee-700">Password *</span>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={6}
                className="gtb-input"
                placeholder="Min. 6 characters"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-coffee-700">Shop address (optional)</span>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="gtb-input"
                placeholder="e.g. Isartalstr. 7, Munich"
              />
            </label>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Creating account..." : "Create account + get 50 beans ☕"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-coffee-600">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-semibold text-coffee-900 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
