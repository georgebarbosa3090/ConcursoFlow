"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { Calendar, PlayCircle, Clock, BookOpen, AlertCircle, FileText } from "lucide-react";
import Link from "next/link";

export default function ItinerarioPage() {
  const sessoesDeHoje = [
    { 
      id: 1, 
      disciplina: "Direito Constitucional", 
      topico: "Direitos e Garantias Fundamentais", 
      tipo: "Teoria", 
      duracao: 45,
      status: "Pendente",
      cor: "bg-blue-100 text-blue-700 border-blue-200",
      icone: BookOpen
    },
    { 
      id: 2, 
      disciplina: "Direito Constitucional", 
      topico: "Direitos Sociais", 
      tipo: "Questões", 
      duracao: 30,
      status: "Pendente",
      cor: "bg-purple-100 text-purple-700 border-purple-200",
      icone: FileText
    },
    { 
      id: 3, 
      disciplina: "Língua Portuguesa", 
      topico: "Sintaxe", 
      tipo: "Revisão Espaçada", 
      duracao: 20,
      status: "Atrasado",
      cor: "bg-orange-100 text-orange-700 border-orange-200",
      icone: AlertCircle
    }
  ];

  return (
    <MainLayout>
      <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Meu Itinerário</h2>
            <p className="text-slate-500">Seu plano adaptativo baseado no Edital da Polícia Federal.</p>
          </div>
          <Link href="/disponibilidade" className="text-sm font-medium text-blue-600 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors flex items-center gap-2">
            <Clock size={16} /> Ajustar Disponibilidade
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg text-slate-900">Sessões de Hoje</h3>
                <span className="text-sm font-medium text-slate-500">Total: 1h 35m</span>
              </div>
              
              <div className="space-y-4">
                {sessoesDeHoje.map(sessao => (
                  <div key={sessao.id} className="group border border-slate-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white cursor-pointer">
                    <div className="flex gap-4 items-center">
                      <div className={`p-3 rounded-lg border ${sessao.cor}`}>
                        <sessao.icone size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{sessao.tipo}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">{sessao.duracao} min</span>
                          {sessao.status === "Atrasado" && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-bold">Atrasado</span>
                          )}
                        </div>
                        <h4 className="font-bold text-slate-900">{sessao.disciplina}</h4>
                        <p className="text-sm text-slate-500 line-clamp-1">{sessao.topico}</p>
                      </div>
                    </div>
                    
                    <button className="w-full md:w-auto mt-4 md:mt-0 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 font-medium rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <PlayCircle size={18} /> Iniciar
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-xl shadow-sm text-white">
              <h3 className="font-bold text-lg mb-2">Recalibração Automática</h3>
              <p className="text-sm text-indigo-100 mb-4">O motor adaptativo identificou dificuldade constante em Sintaxe. Substituímos a revisão de Crase por este tópico hoje.</p>
              <button className="text-xs font-bold uppercase px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded backdrop-blur-sm transition-colors">
                Ver Relatório
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="text-slate-400" size={20} />
                <h3 className="font-bold text-slate-900">Ciclo Semanal</h3>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center">
                {['D','S','T','Q','Q','S','S'].map((dia, i) => (
                  <div key={i} className="text-xs font-medium text-slate-400 mb-2">{dia}</div>
                ))}
                {/* Mock Calendar Days */}
                {[...Array(28)].map((_, i) => (
                  <div key={i} className={`h-8 rounded-full flex items-center justify-center text-sm ${i === 12 ? 'bg-blue-600 text-white font-bold' : i < 12 ? 'bg-green-100 text-green-700' : 'hover:bg-slate-100 text-slate-600'}`}>
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4">Progresso do Edital</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700">Língua Portuguesa</span>
                    <span className="text-slate-500">45%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700">Dir. Constitucional</span>
                    <span className="text-slate-500">12%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '12%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
