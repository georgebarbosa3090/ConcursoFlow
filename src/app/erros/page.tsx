"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { BookX, AlertTriangle, CalendarSync, BrainCircuit } from "lucide-react";

export default function CadernoErrosPage() {
  const erros = [
    {
      id: 1,
      disciplina: "Língua Portuguesa",
      assunto: "Sintaxe da Oração",
      erroTipo: "Confusão entre conceitos (Regência x Concordância)",
      data: "Há 2 dias",
      reincidencias: 3,
      status: "Revisão Necessária"
    },
    {
      id: 2,
      disciplina: "Direito Administrativo",
      assunto: "Atos Administrativos",
      erroTipo: "Desconhecimento de Exceção (Lei 9.784/99)",
      data: "Há 5 dias",
      reincidencias: 1,
      status: "Em Progresso"
    }
  ];

  return (
    <MainLayout>
      <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BookX className="text-red-500" /> Caderno Inteligente de Erros
          </h2>
          <p className="text-slate-500 mt-1">Seus erros transformados em estratégia. O motor adaptativo criará miniavaliações para os erros recorrentes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-red-50 p-4 rounded-xl border border-red-100">
            <div className="flex items-center gap-2 text-red-600 font-bold mb-1">
              <AlertTriangle size={18} /> Erros Críticos
            </div>
            <span className="text-2xl font-bold text-red-900">12</span>
            <p className="text-xs text-red-700/70 mt-1">Alta recorrência detectada</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
            <div className="flex items-center gap-2 text-orange-600 font-bold mb-1">
              <CalendarSync size={18} /> Revisões Pendentes
            </div>
            <span className="text-2xl font-bold text-orange-900">5</span>
            <p className="text-xs text-orange-700/70 mt-1">Agendadas para esta semana</p>
          </div>
          <div className="bg-green-50 p-4 rounded-xl border border-green-100">
            <div className="flex items-center gap-2 text-green-600 font-bold mb-1">
              <BrainCircuit size={18} /> Erros Superados
            </div>
            <span className="text-2xl font-bold text-green-900">28</span>
            <p className="text-xs text-green-700/70 mt-1">Domínio restabelecido</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Registros Recentes</h3>
            <button className="text-sm font-medium text-blue-600 hover:underline">Gerar Lista de Revisão</button>
          </div>
          <div className="divide-y divide-slate-100">
            {erros.map(erro => (
              <div key={erro.id} className="p-4 md:p-6 hover:bg-slate-50 transition-colors">
                <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                  <div>
                    <div className="flex gap-2 mb-2">
                      <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-0.5 rounded border border-blue-100">{erro.disciplina}</span>
                      <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-0.5 rounded">{erro.assunto}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 mb-1">{erro.erroTipo}</h4>
                    <p className="text-sm text-slate-500">Adicionado {erro.data}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-center">
                      <span className="block text-xl font-bold text-slate-700">{erro.reincidencias}</span>
                      <span className="text-xs text-slate-400">Reincidências</span>
                    </div>
                    <button className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium">
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
