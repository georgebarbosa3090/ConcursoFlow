"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { Filter, Search, PlayCircle, BookX } from "lucide-react";
import Link from "next/link";

export default function QuestoesPage() {
  const questoes = [
    { id: 1, banca: "Cebraspe", ano: 2026, orgao: "PF", disciplina: "Informática", assunto: "Redes", tipo: "Certo/Errado" },
    { id: 2, banca: "FGV", ano: 2025, orgao: "Receita", disciplina: "Português", assunto: "Sintaxe", tipo: "Múltipla Escolha" },
    { id: 3, banca: "FCC", ano: 2024, orgao: "TRT", disciplina: "Dir. Trabalho", assunto: "Férias", tipo: "Múltipla Escolha" },
  ];

  return (
    <MainLayout>
      <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Banco de Questões</h2>
            <p className="text-slate-500">Filtre e resolva questões focadas no seu edital.</p>
          </div>
          <Link href="/erros" className="text-sm font-medium text-red-600 bg-red-50 px-4 py-2 rounded-lg border border-red-100 hover:bg-red-100 transition-colors flex items-center gap-2">
            <BookX size={16} /> Caderno de Erros
          </Link>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por palavra-chave..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-6 py-2 bg-slate-100 text-slate-700 font-medium rounded-md hover:bg-slate-200 transition-colors border border-slate-300">
            <Filter size={18} /> Filtros
          </button>
        </div>

        <div className="space-y-4">
          {questoes.map((q) => (
            <div key={q.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-600">
                  <span className="bg-slate-100 px-2 py-1 rounded">{q.orgao}</span>
                  <span className="bg-slate-100 px-2 py-1 rounded">{q.banca}</span>
                  <span className="bg-slate-100 px-2 py-1 rounded">{q.ano}</span>
                  <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100">{q.disciplina}</span>
                </div>
                <span className="text-xs text-slate-400">{q.tipo}</span>
              </div>
              
              <div className="mb-6 text-slate-800">
                <p>Texto base da questão simulada demonstrando como o usuário interagiria com o banco de questões na plataforma do ConcursoFlow AI...</p>
              </div>

              <div className="flex justify-end">
                <Link href="/questoes/resolver" className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">
                  <PlayCircle size={18} /> Resolver Questão
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
