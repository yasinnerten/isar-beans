"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

interface ScanResult {
  ok: boolean;
  uniqueCode: string;
  walletCardId: string;
  shopName: string;
  beansCount: number;
  rewardThreshold: number;
  alreadyPending?: boolean;
}

function ScanContent() {
  const searchParams = useSearchParams();
  const shopId = searchParams.get("shop");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"landing" | "form" | "result">("landing");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [downloading, setDownloading] = useState(false);

  // Generate a stable device ID from localStorage
  function getDeviceId() {
    let id = localStorage.getItem("isar-device-id");
    if (!id) {
      id = `device-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem("isar-device-id", id);
    }
    return id;
  }

  async function requestBean() {
    if (!shopId) return;
    setLoading(true);
    setError(null);

    const deviceId = getDeviceId();
    const res = await fetch("/api/approvals/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shopId,
        deviceId,
        customerName: name || null,
        customerEmail: email || null,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setResult(data);
      setStep("result");
    } else {
      setError(data.error || "Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  async function downloadWalletPass() {
    if (!result?.walletCardId) return;
    setDownloading(true);
    const res = await fetch(`/api/wallet/pass?cardId=${result.walletCardId}`);
    const data = await res.json();

    if (data.demo) {
      // Show the pass JSON for demo
      const blob = new Blob([JSON.stringify(data.pass, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "isarbeans-pass-demo.json";
      a.click();
      URL.revokeObjectURL(url);
      alert("Demo mode: Apple certificates not configured. Downloaded pass data as JSON instead.");
    } else {
      // Real pkpass
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "isarbeans.pkpass";
      a.click();
      URL.revokeObjectURL(url);
    }
    setDownloading(false);
  }

  if (!shopId) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">❓</div>
        <h2 className="text-xl font-bold text-[#5c3316]">Invalid QR code</h2>
        <p className="text-[#7d4a1e] mt-2">This QR code is not associated with any coffee shop.</p>
      </div>
    );
  }

  const pct = result
    ? Math.min(100, Math.round((result.beansCount / result.rewardThreshold) * 100))
    : 0;

  return (
    <div>
      {step === "landing" && (
        <div className="text-center">
          <div className="text-7xl mb-6">☕</div>
          <h1 className="text-3xl font-bold text-[#5c3316] mb-3">Collect your bean!</h1>
          <p className="text-[#7d4a1e] mb-8">
            You scanned an grabthebeans QR code. Add your name/email (optional) to track your beans across visits.
          </p>
          <div className="max-w-sm mx-auto space-y-4 text-left mb-6">
            <div>
              <label className="block text-sm font-medium text-[#5c3316] mb-1.5">
                Your name <span className="text-gray-400">(optional)</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border-2 border-amber-200 rounded-lg px-4 py-3 text-[#3b1a08] focus:outline-none focus:border-amber-500"
                placeholder="e.g. Maria"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5c3316] mb-1.5">
                Email <span className="text-gray-400">(optional, for backup)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-2 border-amber-200 rounded-lg px-4 py-3 text-[#3b1a08] focus:outline-none focus:border-amber-500"
                placeholder="you@example.com"
              />
            </div>
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm max-w-sm mx-auto">
              {error}
            </div>
          )}
          <button
            disabled={loading}
            onClick={requestBean}
            className="bg-[#5c3316] hover:bg-[#7d4a1e] disabled:opacity-60 text-white px-10 py-4 rounded-full font-bold text-lg transition-colors shadow-lg"
          >
            {loading ? "Requesting..." : "🫘 Request my bean"}
          </button>
          <p className="text-xs text-gray-400 mt-4">
            No app needed. Beans are saved to your Apple Wallet.
          </p>
        </div>
      )}

      {step === "result" && result && (
        <div className="text-center">
          <div className="text-7xl mb-4">{result.alreadyPending ? "⏳" : "✅"}</div>
          <h1 className="text-2xl font-bold text-[#5c3316] mb-2">
            {result.alreadyPending ? "Already pending!" : "Bean requested!"}
          </h1>
          <p className="text-[#7d4a1e] mb-8">
            {result.alreadyPending
              ? "You already have a pending request at this shop. Wait for the barista to approve it."
              : `Show your code to the barista at ${result.shopName}. They will approve your bean.`}
          </p>

          {/* Wallet card preview */}
          <div className="max-w-xs mx-auto mb-8">
            <div className="rounded-2xl p-6 text-white coffee-gradient shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-xs text-amber-200 uppercase tracking-widest">grabthebeans</div>
                  <div className="text-lg font-bold">{result.shopName}</div>
                </div>
                <div className="text-3xl">☕</div>
              </div>

              {/* Progress bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-amber-200 mb-1.5">
                  <span>Beans collected</span>
                  <span>{result.beansCount} / {result.rewardThreshold}</span>
                </div>
                <div className="bg-amber-900/50 rounded-full h-3">
                  <div
                    className="bg-amber-400 rounded-full h-3 transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="text-right text-xs text-amber-300 mt-1">{pct}% to free coffee</div>
              </div>

              {/* Unique code */}
              <div className="bg-amber-900/40 rounded-xl p-3 text-center">
                <div className="text-xs text-amber-300 mb-1">Your unique code</div>
                <div className="font-mono font-bold text-amber-100 text-sm tracking-wide">
                  {result.uniqueCode}
                </div>
              </div>
            </div>
          </div>

          {/* Show barista the code */}
          <div className="bean-card p-5 mb-6 max-w-xs mx-auto">
            <p className="text-sm text-[#7d4a1e] mb-2">Show this code to the barista:</p>
            <p className="font-mono font-bold text-[#5c3316] text-xl tracking-wide">
              {result.uniqueCode}
            </p>
          </div>

          {/* Add to Apple Wallet */}
          <button
            onClick={downloadWalletPass}
            disabled={downloading}
            className="bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-colors shadow-lg flex items-center gap-3 mx-auto mb-4"
          >
            <span className="text-2xl">🍎</span>
            {downloading ? "Preparing..." : "Add to Apple Wallet"}
          </button>

          <p className="text-xs text-gray-400 mt-2">
            Every visit to this shop updates the same card. Visit another shop? A new track is added.
          </p>
        </div>
      )}
    </div>
  );
}

export default function ScanPage() {
  return (
    <div className="min-h-screen bg-[#fdf6ee] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <img src="/grabthebeans-logo.png" alt="grabthebeans logo" className="h-8 w-auto mx-auto mb-2 rounded" />
        </div>
        <div className="bean-card p-8">
          <Suspense fallback={<div className="text-center py-8 text-[#7d4a1e]">Loading... ☕</div>}>
            <ScanContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
