"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { useState } from "react";
import { Brain, Flame, Zap, Star, TrendingDown, ChevronRight, RefreshCw, BarChart2 } from "lucide-react";
import Link from "next/link";

// Motor de Repetição Espaçada (algoritmo SM-2 simplificado)
type DifficultyLevel = "facil" | "medio" | "dificil" | "falha";

interface TopicCard {
  id: number;
  disciplina: string;
  topico: string;
  facilidade: number;       // 0-100 (maior = mais fácil)
  ultimaRevisao: string;
  proximaRevisao: string;
  intervalo: number;        // dias até próxima revisão
  status: "nova" | "aprendendo" | "revisao" | "dominada";
  acertos: number;
  erros: number;
}

const CARDS: TopicCard[] = [
  { id: 1, disciplina: "Língua Portuguesa",   topico: "Concordância Verbal",        facilidade: 72, ultimaRevisao: "hoje",      proximaRevisao: "em 3 dias",    intervalo: 3,  status: "aprendendo", acertos: 18, erros: 6 },
  { id: 2, disciplina: "Raciocínio Lógico",   topico: "Tabelas-verdade",            facilidade: 45, ultimaRevisao: "ontem",     proximaRevisao: "amanhã",       intervalo: 1,  status: "aprendendo", acertos: 9,  erros: 8 },
  { id: 3, disciplina: "Dir. Constitucional", topico: "Direitos Sociais",           facilidade: 88, ultimaRevisao: "5 dias",    proximaRevisao: "em 14 dias",   intervalo: 14, status: "dominada",   acertos: 22, erros: 1 },
  { id: 4, disciplina: "Informática",         topico: "Segurança da Informação",   facilidade: 55, ultimaRevisao: "2 dias",    proximaRevisao: "em 2 dias",    intervalo: 2,  status: "revisao",    acertos: 12, erros: 5 },
  { id: 5, disciplina: "Dir. Constitucional", topico: "Controle de Constitucionalidade", facilidade: 30, ultimaRevisao: "hoje", proximaRevisao: "amanhã",      intervalo: 1,  status: "nova",       acertos: 2,  erros: 7 },
  { id: 6, disciplina: "Raciocínio Lógico",   topico: "Diagramas Lógicos",         facilidade: 60, ultimaRevisao: "3 dias",   proximaRevisao: "em 5 dias",    intervalo: 5,  status: "revisao",    acertos: 14, erros: 4 },
];

const STATUS_META = {
  nova:        { label: "Nova",       cor: "bg-slate-100 text-slate-700 border-slate-200",  dot: "bg-slate-400" },
  aprendendo:  { label: "Aprendendo", cor: "bg-blue-50 text-blue-700 border-blue-200",      dot: "bg-blue-500" },
  revisao:     { label: "Em Revisão", cor: "bg-orange-50 text-orange-700 border-orange-200",dot: "bg-orange-400" },
  dominada:    { label: "Dominada",   cor: "bg-green-50 text-green-700 border-green-200",   dot: "bg-green-500" },
};

export default function AdaptacaoPage() {
  const [filterStatus, setFilterStatus] = useState<string>("todos");
  const [simuladoAtivo, setSimuladoAtivo] = useState(false);
  const [simuladoStep, setSimuladoStep] = useState(0);
  const [resposta, setResposta] = useState<DifficultyLevel | null>(null);

  const filtrados = filterStatus === "todos" ? CARDS : CARDS.filter(c => c.status === filterStatus);

  // Tópicos mais urgentes (menor facilidade e revisão mais próxima)
  const urgentes = [...CARDS].sort((a, b) => a.facilidade - b.facilidade).slice(0, 3);

  const SIMULADO_CARDS = CARDS.filter(c => c.status !== "dominada").slice(0, 3);
  const currentCard = SIMULADO_CARDS[simuladoStep];

  function handleResposta(dif: DifficultyLevel) {
    setResposta(dif);
    setTimeout(() => {
      setResposta(null);
      if (simuladoStep < SIMULADO_CARDS.length - 1) {
        setSimuladoStep(s => s + 1);
      } else {
        setSimuladoAtivo(false);
        setSimuladoStep(0);
        alert("Sessão adaptativa concluída! O motor ajustou seus intervalos de revisão.");
      }
    }, 700);
  }

  if (simuladoAtivo && currentCard) {
    return (
      <MainLayout>
        <div className="p-6 md:p-8 max-w-2xl mx-auto">
          {/* Progress bar do simulado */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-slate-500 mb-2">
              <span>Sessão Adaptativa</span>
              <span>{simuladoStep + 1} / {SIMULADO_CARDS.length}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${((simuladoStep + 1) / SIMULADO_CARDS.length) * 100}%` }} />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-8 space-y-8">
            <div>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                {currentCard.disciplina}
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-4 mb-2">
                Avalie seu conhecimento em:
              </h3>
              <p className="text-2xl font-extrabold text-slate-900">{currentCard.topico}</p>
              <p className="text-slate-500 text-sm mt-2">
                Acertos anteriores: <strong>{currentCard.acertos}</strong> | Erros: <strong>{currentCard.erros}</strong>
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-600 mb-4">Como você se sentiu neste tópico?</p>
              <div className="grid grid-cols-2 gap-3">
                {([
                  { id: "falha" as DifficultyLevel,   label: "Errei / Não lembro",    icon: TrendingDown, cor: "border-red-200    hover:bg-red-50    hover:border-red-400    text-red-700"    },
                  { id: "dificil" as DifficultyLevel, label: "Difícil, mas acertei",   icon: Zap,          cor: "border-orange-200 hover:bg-orange-50 hover:border-orange-400 text-orange-700" },
                  { id: "medio" as DifficultyLevel,   label: "Com esforço",             icon: BarChart2,    cor: "border-blue-200   hover:bg-blue-50   hover:border-blue-400   text-blue-700"   },
                  { id: "facil" as DifficultyLevel,   label: "Fácil / Domino bem",      icon: Star,         cor: "border-green-200  hover:bg-green-50  hover:border-green-400  text-green-700"  },
                ] as const).map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => handleResposta(opt.id)}
                    disabled={resposta !== null}
                    className={`flex items-center gap-3 p-4 border-2 rounded-xl transition-all font-medium text-sm ${opt.cor} ${resposta === opt.id ? "ring-2 ring-offset-1 ring-blue-400 scale-95" : ""} disabled:cursor-default`}
                  >
                    <opt.icon size={20} />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Brain className="text-blue-600" size={28} /> Motor Adaptativo
            </h2>
            <p className="text-slate-500 mt-1">Algoritmo SM-2 de Repetição Espaçada — cada tópico recebe um intervalo calculado com base no seu desempenho.</p>
          </div>
          <button
            onClick={() => setSimuladoAtivo(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition shadow-md shadow-blue-500/20"
          >
            <Flame size={18} /> Iniciar Sessão Adaptativa
          </button>
        </div>

        {/* Alerta de urgentes */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
          <h3 className="font-bold text-orange-800 flex items-center gap-2 mb-3">
            <Zap size={18} /> Tópicos Prioritários Agora
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {urgentes.map(card => (
              <div key={card.id} className="bg-white rounded-lg border border-orange-100 p-4 flex items-center justify-between group hover:border-orange-300 transition cursor-pointer">
                <div>
                  <p className="text-xs font-medium text-slate-500">{card.disciplina}</p>
                  <p className="font-bold text-slate-900 text-sm">{card.topico}</p>
                  <p className="text-xs text-orange-600 font-medium mt-1">Facilidade: {card.facilidade}%</p>
                </div>
                <ChevronRight size={18} className="text-slate-300 group-hover:text-orange-500 transition" />
              </div>
            ))}
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2">
          {(["todos", "nova", "aprendendo", "revisao", "dominada"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilterStatus(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                filterStatus === f
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
              }`}
            >
              {f === "todos" ? "Todos os tópicos" : STATUS_META[f].label}
            </button>
          ))}
        </div>

        {/* Lista de tópicos */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="grid grid-cols-12 px-6 py-3 bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <div className="col-span-4">Tópico</div>
            <div className="col-span-2 hidden md:block">Status</div>
            <div className="col-span-2 hidden md:block">Facilidade</div>
            <div className="col-span-2 hidden md:block">Última Revisão</div>
            <div className="col-span-2">Próxima</div>
          </div>

          <div className="divide-y divide-slate-50">
            {filtrados.map(card => {
              const meta = STATUS_META[card.status];
              const pct = card.facilidade;
              const barColor = pct >= 75 ? "bg-green-500" : pct >= 50 ? "bg-blue-500" : pct >= 30 ? "bg-orange-400" : "bg-red-400";

              return (
                <div key={card.id} className="grid grid-cols-12 px-6 py-4 items-center hover:bg-slate-50/50 transition group">
                  <div className="col-span-4 md:col-span-4">
                    <p className="font-bold text-slate-900 text-sm">{card.topico}</p>
                    <p className="text-xs text-slate-500">{card.disciplina}</p>
                  </div>
                  <div className="col-span-2 hidden md:block">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${meta.cor}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                      {meta.label}
                    </span>
                  </div>
                  <div className="col-span-2 hidden md:flex items-center gap-2">
                    <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-slate-500 shrink-0">{pct}%</span>
                  </div>
                  <div className="col-span-2 hidden md:block text-xs text-slate-500">{card.ultimaRevisao}</div>
                  <div className="col-span-8 md:col-span-2 flex items-center justify-between">
                    <span className={`text-xs font-medium ${card.intervalo <= 1 ? "text-red-600" : card.intervalo <= 3 ? "text-orange-500" : "text-slate-500"}`}>
                      {card.proximaRevisao}
                    </span>
                    <button className="opacity-0 group-hover:opacity-100 ml-2 p-1.5 bg-blue-50 text-blue-600 rounded-lg transition hover:bg-blue-100">
                      <RefreshCw size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legenda SM-2 */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-6 text-white">
          <h3 className="font-bold mb-3 flex items-center gap-2"><Brain size={18} /> Como funciona o algoritmo SM-2?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-300">
            <p>O <strong className="text-white">SM-2 (SuperMemo 2)</strong> calcula o intervalo ideal entre revisões com base no quão fácil você considerou cada tópico.</p>
            <p>Quanto mais vezes você acerta um tópico com facilidade, <strong className="text-white">maior o intervalo</strong> antes da próxima revisão — liberando tempo para estudar o que realmente precisa.</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
