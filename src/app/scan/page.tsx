"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { WalletCardPreview } from "@/components/WalletCardPreview";

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
      const blob = new Blob([JSON.stringify(data.pass, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "isarbeans-pass-demo.json";
      a.click();
      URL.revokeObjectURL(url);
      alert("Demo mode: Apple certificates not configured. Downloaded pass data as JSON instead.");
    } else {
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
        <h2 className="text-xl font-bold text-coffee-900">Invalid QR code</h2>
        <p className="text-coffee-600 mt-2">This QR code is not associated with any coffee shop.</p>
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
          <h1 className="text-3xl font-bold text-coffee-900 mb-3">Collect your bean!</h1>
          <p className="text-coffee-600 mb-8">
            You scanned a grabthebeans QR code. Add your name/email (optional) to track your beans across visits.
          </p>
          <div className="max-w-sm mx-auto space-y-4 text-left mb-6">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-coffee-700">
                Your name <span className="text-coffee-400">(optional)</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="gtb-input"
                placeholder="e.g. Maria"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-coffee-700">
                Email <span className="text-coffee-400">(optional, for backup)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="gtb-input"
                placeholder="you@example.com"
              />
            </div>
          </div>
          {error && (
            <div className="mb-4 max-w-sm mx-auto rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
              {error}
            </div>
          )}
          <button
            disabled={loading}
            onClick={requestBean}
            className="btn-primary px-10 py-4 text-lg shadow-lg"
          >
            {loading ? "Requesting..." : "🫘 Request my bean"}
          </button>
          <p className="text-xs text-coffee-400 mt-4">
            No app needed. Beans are saved to your Apple Wallet.
          </p>
        </div>
      )}

      {step === "result" && result && (
        <div className="space-y-5">
          <div className="surface p-6 text-center">
            <div className="text-5xl mb-2">{result.alreadyPending ? "⏳" : "✅"}</div>
            <h1 className="text-xl font-bold tracking-tight text-coffee-900">
              {result.alreadyPending ? "Already pending!" : "Bean requested!"}
            </h1>
            <p className="mt-1 text-sm text-coffee-600">
              {result.alreadyPending
                ? "You already have a pending request at this shop. Wait for the barista to approve it."
                : `Show your code to the barista at ${result.shopName}. They will approve your bean.`}
            </p>
          </div>

          <WalletCardPreview
            shopName={result.shopName}
            beans={result.beansCount}
            threshold={result.rewardThreshold}
            uniqueCode={result.uniqueCode}
            progressLabel="to free coffee"
            beansLabel="beans"
          />

          <div className="surface p-5 text-center">
            <p className="text-xs uppercase tracking-wider text-coffee-500">Show this code to the barista</p>
            <p className="mt-2 select-all font-mono text-lg font-bold text-coffee-900">{result.uniqueCode}</p>
          </div>

          <button
            onClick={downloadWalletPass}
            disabled={downloading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-black py-3.5 font-semibold text-white transition hover:bg-coffee-900"
          >
            <span>🍎</span>
            {downloading ? "Preparing..." : "Add to Apple Wallet"}
          </button>

          <p className="text-center text-xs text-coffee-500">
            Every visit to this shop updates the same card. Visit another shop? A new track is added.
          </p>
        </div>
      )}
    </div>
  );
}

export default function ScanPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center">
          <img src="/grabthebeans-logo.png" alt="grabthebeans" className="h-10 w-10 object-contain" />
        </div>
        <div className="surface p-8">
          <Suspense fallback={<div className="py-8 text-center text-coffee-600">Loading... ☕</div>}>
            <ScanContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
