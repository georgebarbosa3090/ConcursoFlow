import { MainLayout } from "@/components/layout/main-layout";
import { Filter, Search, PlayCircle, BookX, Sparkles } from "lucide-react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { GerarQuestoesBtn } from "./gerar-btn";

export const dynamic = "force-dynamic";

export default async function QuestoesPage() {
  const questoes = await prisma.question.findMany({
    orderBy: { id: 'desc' },
    take: 50 // Limitando às 50 últimas por enquanto
  });

  return (
    <MainLayout>
      <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Banco de Questões</h2>
            <p className="text-slate-500">Resolva as questões reais injetadas no seu banco de dados.</p>
          </div>
          <div className="flex gap-3">
            <GerarQuestoesBtn />
            <Link href="/erros" className="text-sm font-medium text-red-600 bg-red-50 px-4 py-2 rounded-lg border border-red-100 hover:bg-red-100 transition-colors flex items-center gap-2">
              <BookX size={16} /> Caderno de Erros
            </Link>
          </div>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por disciplina ou assunto..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-6 py-2 bg-slate-100 text-slate-700 font-medium rounded-md hover:bg-slate-200 transition-colors border border-slate-300">
            <Filter size={18} /> Filtros
          </button>
        </div>

        <div className="space-y-4">
          {questoes.length === 0 ? (
            <div className="text-center py-12 text-slate-500 bg-white rounded-xl border border-slate-200">
              <p>Nenhuma questão encontrada. Rode o seed do banco ou gere novas via IA!</p>
            </div>
          ) : (
            questoes.map((q) => (
              <div key={q.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                  <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-600">
                    <span className="bg-slate-100 px-2 py-1 rounded">{q.board || "Diversos"}</span>
                    <span className="bg-slate-100 px-2 py-1 rounded">{q.year || "2024"}</span>
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100">
                      {q.type === "CERTO_ERRADO" ? "Certo/Errado" : "Múltipla Escolha"}
                    </span>
                  </div>
                </div>
                
                <div className="mb-6 text-slate-800">
                  <p>{q.text}</p>
                </div>

                <div className="flex justify-end">
                  <Link href={`/questoes/resolver/${q.id}`} className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">
                    <PlayCircle size={18} /> Resolver Questão
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
}
