"use client";

import { useEffect, useState } from "react";

interface ShopData {
  name: string;
  address: string | null;
  lat: number | null;
  lng: number | null;
  rewardThreshold: number;
  description: string | null;
}

export default function SettingsPage() {
  const [form, setForm] = useState<ShopData>({
    name: "",
    address: "",
    lat: null,
    lng: null,
    rewardThreshold: 10,
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  useEffect(() => {
    fetch("/api/shop/me")
      .then((r) => r.json())
      .then((data) => {
        setForm({
          name: data.name || "",
          address: data.address || "",
          lat: data.lat || null,
          lng: data.lng || null,
          rewardThreshold: data.rewardThreshold || 10,
          description: data.description || "",
        });
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/shop/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      showToast("Settings saved! ✓");
    } else {
      showToast("Failed to save settings", "error");
    }
    setSaving(false);
  }

  if (loading) return <div className="text-coffee-600">Loading... ☕</div>;

  return (
    <div className="mx-auto max-w-xl space-y-6">
      {toast && (
        <div className={`fixed top-6 right-6 z-50 rounded-xl px-6 py-3 text-sm font-medium text-white shadow-lg ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
          {toast.msg}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-coffee-900 sm:text-3xl">Settings ⚙️</h1>
        <p className="mt-1 text-coffee-600">Configure your coffee shop profile and rewards</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="surface p-6 space-y-5">
          <h2 className="text-lg font-bold text-coffee-900 border-b border-coffee-100 pb-3">
            Shop details
          </h2>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-coffee-700">Shop name</span>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="gtb-input"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-coffee-700">Shop description</span>
            <textarea
              value={form.description || ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="gtb-input"
              placeholder="Tell customers what makes your coffee special..."
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-coffee-700">Address</span>
            <input
              type="text"
              value={form.address || ""}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="gtb-input"
              placeholder="e.g. Isartalstr. 7, 80469 Munich"
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-coffee-700">Latitude</span>
              <input
                type="number"
                step="any"
                value={form.lat ?? ""}
                onChange={(e) => setForm({ ...form, lat: e.target.value ? parseFloat(e.target.value) : null })}
                className="gtb-input"
                placeholder="48.1374"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-coffee-700">Longitude</span>
              <input
                type="number"
                step="any"
                value={form.lng ?? ""}
                onChange={(e) => setForm({ ...form, lng: e.target.value ? parseFloat(e.target.value) : null })}
                className="gtb-input"
                placeholder="11.5755"
              />
            </label>
          </div>
        </div>

        <div className="surface p-6 space-y-5">
          <h2 className="text-lg font-bold text-coffee-900 border-b border-coffee-100 pb-3">
            Reward configuration
          </h2>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-coffee-700">Reward threshold (beans for free coffee)</span>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="5"
                max="50"
                step="1"
                value={form.rewardThreshold}
                onChange={(e) => setForm({ ...form, rewardThreshold: parseInt(e.target.value) })}
                className="flex-1 accent-coffee-800"
              />
              <div className="min-w-[64px] rounded-xl bg-sand px-4 py-2 text-center text-lg font-bold text-coffee-900">
                {form.rewardThreshold}
              </div>
            </div>
            <p className="mt-2 text-xs text-coffee-600">
              Customers need <strong>{form.rewardThreshold} beans</strong> to earn a free coffee or discount.
              This will be reflected on their Apple Wallet card.
            </p>
          </label>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="btn-primary w-full"
        >
          {saving ? "Saving..." : "Save settings ✓"}
        </button>
      </form>
    </div>
  );
}
