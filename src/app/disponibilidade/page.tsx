"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, CalendarDays, CheckCircle2 } from "lucide-react";

export default function DisponibilidadePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const diasDaSemana = [
    { id: 1, nome: "Segunda-feira" },
    { id: 2, nome: "Terça-feira" },
    { id: 3, nome: "Quarta-feira" },
    { id: 4, nome: "Quinta-feira" },
    { id: 5, nome: "Sexta-feira" },
    { id: 6, nome: "Sábado" },
    { id: 0, nome: "Domingo" },
  ];

  const [disponibilidade, setDisponibilidade] = useState<Record<number, { ativo: boolean; horas: string }>>(
    diasDaSemana.reduce((acc, dia) => {
      acc[dia.id] = { ativo: dia.id >= 1 && dia.id <= 5, horas: "2" };
      return acc;
    }, {} as Record<number, { ativo: boolean; horas: string }>)
  );

  const handleToggle = (id: number) => {
    setDisponibilidade(prev => ({
      ...prev,
      [id]: { ...prev[id], ativo: !prev[id].ativo }
    }));
  };

  const handleHorasChange = (id: number, horas: string) => {
    setDisponibilidade(prev => ({
      ...prev,
      [id]: { ...prev[id], horas }
    }));
  };

  const handleSalvar = () => {
    setLoading(true);
    // Simula salvamento via API
    setTimeout(() => {
      setLoading(false);
      alert("Disponibilidade salva com sucesso! Seu itinerário será ajustado.");
      router.push("/plano");
    }, 800);
  };

  return (
    <MainLayout>
      <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Configurar Disponibilidade</h2>
          <p className="text-slate-500">Informe quantas horas você tem disponíveis para estudar a cada dia. O Planejador Adaptativo usará isso para recalcular suas metas.</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="space-y-4">
            {diasDaSemana.map((dia) => {
              const config = disponibilidade[dia.id];
              return (
                <div key={dia.id} className={`flex items-center justify-between p-4 rounded-lg border ${config.ativo ? 'border-blue-200 bg-blue-50/50' : 'border-slate-200 bg-slate-50'}`}>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => handleToggle(dia.id)}
                      className={`w-6 h-6 rounded-full flex items-center justify-center border ${config.ativo ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 text-transparent'}`}
                    >
                      <CheckCircle2 size={16} />
                    </button>
                    <span className={`font-medium ${config.ativo ? 'text-slate-900' : 'text-slate-500'}`}>{dia.nome}</span>
                  </div>
                  
                  {config.ativo ? (
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-slate-400" />
                      <select 
                        value={config.horas}
                        onChange={(e) => handleHorasChange(dia.id, e.target.value)}
                        className="p-1 border border-slate-300 rounded outline-none text-sm bg-white"
                      >
                        <option value="1">1 hora</option>
                        <option value="2">2 horas</option>
                        <option value="3">3 horas</option>
                        <option value="4">4 horas</option>
                        <option value="5">5 horas</option>
                        <option value="6">6 horas</option>
                        <option value="8">8 horas (Integral)</option>
                      </select>
                    </div>
                  ) : (
                    <span className="text-sm text-slate-400 italic">Descanso</span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button 
              onClick={() => router.back()}
              className="px-6 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors font-medium">
              Cancelar
            </button>
            <button 
              onClick={handleSalvar}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors font-medium disabled:opacity-70">
              {loading ? "Salvando..." : "Salvar Disponibilidade"}
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
