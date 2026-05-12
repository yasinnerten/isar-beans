"use client";

import { useEffect, useState } from "react";

interface Approval {
  id: string;
  uniqueCode: string;
  beansAmount: number;
  createdAt: string;
  customer: { name: string | null; email: string | null; deviceId: string | null };
}

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  useEffect(() => {
    fetch("/api/approvals/pending")
      .then((r) => r.json())
      .then(setApprovals)
      .finally(() => setLoading(false));
  }, []);

  async function handle(approvalId: string, action: "approve" | "reject") {
    setProcessing(approvalId);
    const res = await fetch("/api/approvals/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approvalId, action }),
    });
    if (res.ok) {
      setApprovals((prev) => prev.filter((a) => a.id !== approvalId));
      showToast(action === "approve" ? "Bean approved! ☕" : "Request rejected");
    } else {
      const data = await res.json();
      showToast(data.error || "Error processing", "error");
    }
    setProcessing(null);
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {toast && (
        <div className={`fixed top-6 right-6 z-50 rounded-xl px-6 py-3 text-sm font-medium text-white shadow-lg ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
          {toast.msg}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-coffee-900 sm:text-3xl">Bean Approvals ✅</h1>
        <p className="mt-1 text-coffee-600">Review and approve customer bean collection requests</p>
      </div>

      {loading ? (
        <div className="text-coffee-600">Loading... ☕</div>
      ) : approvals.length === 0 ? (
        <div className="surface p-12 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-xl font-bold text-coffee-900 mb-2">All caught up!</h2>
          <p className="text-coffee-600">No pending approvals at the moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {approvals.map((a) => (
            <div key={a.id} className="surface flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-sand">
                  <span className="font-mono text-xs font-bold text-coffee-700">{a.uniqueCode}</span>
                </div>
                <div>
                  <p className="font-semibold text-coffee-900">
                    {a.customer.name || a.customer.email || a.customer.deviceId || "Anonymous customer"}
                  </p>
                  <p className="text-sm text-coffee-600 mt-0.5">
                    Requesting {a.beansAmount} bean{a.beansAmount > 1 ? "s" : ""}
                  </p>
                  <p className="text-xs text-coffee-500 mt-0.5">
                    {new Date(a.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  disabled={processing === a.id}
                  onClick={() => handle(a.id, "approve")}
                  className="rounded-full bg-coffee-900 px-5 py-2.5 text-sm font-semibold text-cream hover:bg-coffee-800 disabled:opacity-50"
                >
                  ✓ Approve bean
                </button>
                <button
                  disabled={processing === a.id}
                  onClick={() => handle(a.id, "reject")}
                  className="rounded-full border border-coffee-200 px-4 py-2.5 text-sm font-semibold text-coffee-700 hover:bg-sand disabled:opacity-50"
                >
                  ✗ Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
