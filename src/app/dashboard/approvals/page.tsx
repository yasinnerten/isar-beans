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
    <div>
      {/* Toast */}
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
        <h1 className="text-2xl font-bold text-[#5c3316]">Bean Approvals ✅</h1>
        <p className="text-[#7d4a1e] mt-1">Review and approve customer bean collection requests</p>
      </div>

      {loading ? (
        <div className="text-[#7d4a1e]">Loading... ☕</div>
      ) : approvals.length === 0 ? (
        <div className="bean-card p-12 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-xl font-bold text-[#5c3316] mb-2">All caught up!</h2>
          <p className="text-[#7d4a1e]">No pending approvals at the moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {approvals.map((a) => (
            <div key={a.id} className="bean-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-amber-100 rounded-2xl p-4 text-center min-w-[80px]">
                  <div className="text-amber-700 font-mono text-xs font-bold leading-tight">{a.uniqueCode}</div>
                </div>
                <div>
                  <p className="font-semibold text-[#3b1a08]">
                    {a.customer.name || a.customer.email || a.customer.deviceId || "Anonymous customer"}
                  </p>
                  <p className="text-sm text-[#7d4a1e] mt-0.5">
                    Requesting {a.beansAmount} bean{a.beansAmount > 1 ? "s" : ""}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(a.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  disabled={processing === a.id}
                  onClick={() => handle(a.id, "approve")}
                  className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors"
                >
                  ✓ Approve bean
                </button>
                <button
                  disabled={processing === a.id}
                  onClick={() => handle(a.id, "reject")}
                  className="bg-red-50 hover:bg-red-100 disabled:opacity-50 text-red-700 border border-red-200 px-4 py-2.5 rounded-xl text-sm transition-colors"
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
