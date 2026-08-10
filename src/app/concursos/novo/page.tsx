"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const bancas = ["Cebraspe", "FGV", "FCC", "VUNESP", "CESPE", "IBFC", "Quadrix", "NC-UFPR", "Instituto AOCP", "FEPESE"];

export default function NovoConcursoPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [board, setBoard] = useState("");
  const [status, setStatus] = useState("OPEN");
  const [url, setUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/editais/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, title, board })
      });

      if (res.ok) {
        const result = await res.json();
        sessionStorage.setItem("importedEditalData", JSON.stringify(result.dados));
        router.push("/concursos/importar/revisao");
      } else {
        alert("Erro ao processar edital. Verifique a URL e tente novamente.");
        setIsLoading(false);
      }
    } catch {
      alert("Falha na comunicação com o servidor.");
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Cadastrar Concurso</h2>
          <p className="text-slate-500">Preencha as informações e o Agente de Editais extrairá o conteúdo automaticamente.</p>
        </div>

        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1.5">Título do Concurso / Órgão</label>
              <input
                id="title"
                required
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Ex: Polícia Federal — Agente"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="board" className="block text-sm font-medium text-slate-700 mb-1.5">Banca Organizadora</label>
                <select
                  id="board"
                  value={board}
                  onChange={e => setBoard(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white transition"
                >
                  <option value="">Selecione a banca…</option>
                  {bancas.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
                <select
                  id="status"
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white transition"
                >
                  <option value="OPEN">Edital Publicado</option>
                  <option value="AUTHORIZED">Autorizado (Previsto)</option>
                  <option value="STUDYING">Em Estudo (Sem Edital)</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="url" className="block text-sm font-medium text-slate-700 mb-1.5">Link do Edital (URL)</label>
              <input
                id="url"
                required
                type="url"
                value={url}
                onChange={e => setUrl(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="https://..."
              />
              <p className="text-xs text-slate-500 mt-1.5">O Agente de Editais analisará o PDF e extrairá disciplinas e pesos automaticamente.</p>
            </div>

            <div className="pt-2 flex justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => router.push("/concursos")}
                className="px-5 py-2.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                id="importar-submit"
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-2.5 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition font-medium shadow-sm disabled:opacity-60"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {isLoading ? "Extraindo Edital…" : "Importar Edital"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}
