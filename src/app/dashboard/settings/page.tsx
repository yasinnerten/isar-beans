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

  if (loading) return <div className="text-[#7d4a1e]">Loading... ☕</div>;

  return (
    <div>
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.msg}
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#5c3316]">Settings ⚙️</h1>
        <p className="text-[#7d4a1e] mt-1">Configure your coffee shop profile and rewards</p>
      </div>

      <form onSubmit={handleSave} className="max-w-xl space-y-6">
        <div className="bean-card p-6 space-y-5">
          <h2 className="font-bold text-[#5c3316] text-lg border-b border-amber-200 pb-3">
            Shop details
          </h2>

          <div>
            <label className="block text-sm font-medium text-[#5c3316] mb-1.5">Shop name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full border-2 border-amber-200 rounded-lg px-4 py-3 text-[#3b1a08] focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#5c3316] mb-1.5">
              Shop description
            </label>
            <textarea
              value={form.description || ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full border-2 border-amber-200 rounded-lg px-4 py-3 text-[#3b1a08] focus:outline-none focus:border-amber-500"
              placeholder="Tell customers what makes your coffee special..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#5c3316] mb-1.5">Address</label>
            <input
              type="text"
              value={form.address || ""}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full border-2 border-amber-200 rounded-lg px-4 py-3 text-[#3b1a08] focus:outline-none focus:border-amber-500"
              placeholder="e.g. Isartalstr. 7, 80469 Munich"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#5c3316] mb-1.5">
                Latitude (for map)
              </label>
              <input
                type="number"
                step="any"
                value={form.lat ?? ""}
                onChange={(e) => setForm({ ...form, lat: e.target.value ? parseFloat(e.target.value) : null })}
                className="w-full border-2 border-amber-200 rounded-lg px-4 py-3 text-[#3b1a08] focus:outline-none focus:border-amber-500"
                placeholder="48.1374"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5c3316] mb-1.5">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                value={form.lng ?? ""}
                onChange={(e) => setForm({ ...form, lng: e.target.value ? parseFloat(e.target.value) : null })}
                className="w-full border-2 border-amber-200 rounded-lg px-4 py-3 text-[#3b1a08] focus:outline-none focus:border-amber-500"
                placeholder="11.5755"
              />
            </div>
          </div>
        </div>

        <div className="bean-card p-6 space-y-5">
          <h2 className="font-bold text-[#5c3316] text-lg border-b border-amber-200 pb-3">
            Reward configuration
          </h2>

          <div>
            <label className="block text-sm font-medium text-[#5c3316] mb-1.5">
              Reward threshold (beans for free coffee)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="5"
                max="50"
                step="1"
                value={form.rewardThreshold}
                onChange={(e) => setForm({ ...form, rewardThreshold: parseInt(e.target.value) })}
                className="flex-1 accent-amber-600"
              />
              <div className="bg-amber-100 rounded-xl px-4 py-2 font-bold text-[#5c3316] text-lg min-w-[64px] text-center">
                {form.rewardThreshold}
              </div>
            </div>
            <p className="text-xs text-[#7d4a1e] mt-2">
              Customers need <strong>{form.rewardThreshold} beans</strong> to earn a free coffee or discount.
              This will be reflected on their Apple Wallet card.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-[#5c3316] hover:bg-[#7d4a1e] disabled:opacity-60 text-white py-3 rounded-xl font-semibold transition-colors"
        >
          {saving ? "Saving..." : "Save settings ✓"}
        </button>
      </form>
    </div>
  );
}
