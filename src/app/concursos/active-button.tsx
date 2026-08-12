"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, Target } from "lucide-react";

export function ActiveButton({ examId, isActive }: { examId: string, isActive: boolean }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (isActive) {
    return (
      <span className="flex items-center gap-1.5 bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-md border border-indigo-200">
        <Target size={14} /> Foco Atual
      </span>
    );
  }

  return (
    <button
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        await fetch("/api/editais/ativar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ examId })
        });
        router.refresh();
      }}
      className="text-xs font-bold text-slate-500 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 px-2.5 py-1 rounded-md border border-slate-200 transition-colors flex items-center gap-1.5 disabled:opacity-50"
    >
      {loading ? <Loader2 size={12} className="animate-spin" /> : <Target size={14} />}
      Definir como Foco
    </button>
  );
}
