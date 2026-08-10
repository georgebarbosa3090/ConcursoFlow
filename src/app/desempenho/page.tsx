"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { Brain, Target, TrendingUp, AlertCircle } from "lucide-react";
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend
} from 'recharts';
import { useState, useEffect } from "react";

export default function DesempenhoPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const radarData = [
    { subject: 'Domínio', current: 80, goal: 90, fullMark: 100 },
    { subject: 'Retenção', current: 65, goal: 85, fullMark: 100 },
    { subject: 'Velocidade', current: 75, goal: 80, fullMark: 100 },
    { subject: 'Interpretação', current: 90, goal: 85, fullMark: 100 },
    { subject: 'Precisão', current: 70, goal: 90, fullMark: 100 },
    { subject: 'Consistência', current: 85, goal: 95, fullMark: 100 },
  ];

  const evolutionData = [
    { name: 'Semana 1', acertos: 65 },
    { name: 'Semana 2', acertos: 68 },
    { name: 'Semana 3', acertos: 72 },
    { name: 'Semana 4', acertos: 70 },
    { name: 'Semana 5', acertos: 78 },
    { name: 'Semana 6', acertos: 82 },
  ];

  if (!isClient) return null;

  return (
    <MainLayout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Analytics e Desempenho</h2>
          <p className="text-slate-500">Acompanhe sua evolução e índice de prontidão para a prova.</p>
        </div>

        {/* Readiness Index */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 md:p-8 text-white shadow-md flex flex-col md:flex-row items-center gap-8 justify-between">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2 text-blue-100 font-medium">
              <Target size={20} />
              Índice de Prontidão Estimado
            </div>
            <h3 className="text-5xl font-bold">78%</h3>
            <p className="text-blue-100 max-w-md text-sm leading-relaxed">
              Com base no seu desempenho atual, retenção de conteúdo e velocidade, esta é sua chance estimada de atingir a nota de corte do edital.
            </p>
          </div>
          <div className="w-full md:w-1/3 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20">
            <h4 className="font-bold text-sm mb-3">Fatores de Impacto</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-between">
                <span className="text-blue-100">Precisão em exatas</span>
                <span className="text-red-300 font-bold flex items-center gap-1"><AlertCircle size={14}/> -5%</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-blue-100">Consistência de revisões</span>
                <span className="text-green-300 font-bold flex items-center gap-1"><TrendingUp size={14}/> +8%</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
          {/* Radar Chart */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Brain className="text-blue-600" size={20} />
              Árvore de Habilidades
            </h3>
            <p className="text-sm text-slate-500 mb-6">Comparação do seu perfil atual com a meta ideal para aprovação.</p>
            <div className="flex-1 min-h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Atual" dataKey="current" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                  <Radar name="Meta" dataKey="goal" stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeDasharray="3 3" />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Line Chart */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
              <TrendingUp className="text-blue-600" size={20} />
              Evolução da Taxa de Acertos
            </h3>
            <p className="text-sm text-slate-500 mb-6">Sua performance global nas últimas 6 semanas.</p>
            <div className="flex-1 min-h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={evolutionData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} tickFormatter={(val) => `${val}%`} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="acertos" name="Acertos" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
