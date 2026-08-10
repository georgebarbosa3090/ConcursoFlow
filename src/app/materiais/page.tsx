"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { BookOpen, FileText, Brain, Youtube, Plus, Search } from "lucide-react";

const materiais = [
  { id: 1, titulo: "Teoria Geral do Direito Constitucional", disciplina: "Dir. Constitucional", tipo: "PDF", paginas: 45, progresso: 60 },
  { id: 2, titulo: "Redes: Camadas OSI e TCP/IP", disciplina: "Informática", tipo: "Mapa Mental", paginas: 8, progresso: 100 },
  { id: 3, titulo: "Sintaxe — Concordância e Regência", disciplina: "Português", tipo: "Resumo", paginas: 12, progresso: 30 },
  { id: 4, titulo: "Raciocínio Lógico — Tabelas-Verdade", disciplina: "Raciocínio Lógico", tipo: "PDF", paginas: 22, progresso: 0 },
];

const tipoIcon = {
  "PDF": FileText,
  "Mapa Mental": Brain,
  "Resumo": BookOpen,
  "Vídeo": Youtube,
};

const tipoCor = {
  "PDF": "bg-red-50 text-red-700 border-red-100",
  "Mapa Mental": "bg-purple-50 text-purple-700 border-purple-100",
  "Resumo": "bg-blue-50 text-blue-700 border-blue-100",
  "Vídeo": "bg-orange-50 text-orange-700 border-orange-100",
};

export default function MateriaisPage() {
  return (
    <MainLayout>
      <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Materiais de Estudo</h2>
            <p className="text-slate-500">PDFs, resumos e mapas mentais gerados pelo seu plano de estudos.</p>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition shadow-sm">
            <Plus size={18} /> Adicionar Material
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Buscar material por título ou disciplina…"
            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {materiais.map(mat => {
            const Icon = tipoIcon[mat.tipo as keyof typeof tipoIcon] ?? FileText;
            const cor = tipoCor[mat.tipo as keyof typeof tipoCor] ?? "bg-slate-100 text-slate-700 border-slate-200";
            return (
              <div key={mat.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all p-5 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-900 leading-snug">{mat.titulo}</h3>
                    <p className="text-sm text-slate-500 mt-1">{mat.disciplina} • {mat.paginas} páginas</p>
                  </div>
                  <span className={`shrink-0 flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-full border ${cor}`}>
                    <Icon size={13} /> {mat.tipo}
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                    <span>Progresso</span>
                    <span className={mat.progresso === 100 ? "text-green-600 font-bold" : ""}>{mat.progresso}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${mat.progresso === 100 ? "bg-green-500" : "bg-blue-500"}`}
                      style={{ width: `${mat.progresso}%` }}
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button className="flex-1 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition">
                    {mat.progresso === 0 ? "Iniciar Leitura" : mat.progresso === 100 ? "Revisar" : "Continuar"}
                  </button>
                  <button className="px-3 py-2 text-slate-500 hover:text-slate-800 border border-slate-200 hover:border-slate-300 rounded-lg transition">
                    <Brain size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}
