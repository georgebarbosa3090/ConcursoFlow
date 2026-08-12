import { MainLayout } from "@/components/layout/main-layout";
import { Filter, Search, PlayCircle, BookX, Sparkles } from "lucide-react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { GerarQuestoesBtn } from "./gerar-btn";
import { FiltrosClient } from "./filtros-client";

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

        <FiltrosClient />

        <div className="space-y-4">
          {questoes.length === 0 ? (
            <div className="text-center py-12 text-slate-500 bg-white rounded-xl border border-slate-200">
              <p>Nenhuma questão encontrada. Rode o seed do banco ou gere novas via IA!</p>
            </div>
          ) : (
            questoes.map((q) => (
              <div key={q.id} className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-md transition-all relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-100 group-hover:bg-blue-500 transition-colors"></div>
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-5 pb-5 border-b border-slate-100">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-600">
                    <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded border border-blue-100">{q.board || "Diversos"}</span>
                    <span className="bg-slate-100 px-2.5 py-1 rounded">{q.year || "2026"}</span>
                    <span className="bg-slate-100 px-2.5 py-1 rounded text-slate-500">
                      {q.type === "CERTO_ERRADO" ? "Certo/Errado" : "Múltipla Escolha"}
                    </span>
                  </div>
                </div>
                
                <div className="mb-8 prose prose-slate max-w-none text-slate-800 leading-relaxed font-medium">
                  <p className="line-clamp-3">{q.text}</p>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-50">
                  <Link href={`/questoes/resolver/${q.id}`} className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
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
