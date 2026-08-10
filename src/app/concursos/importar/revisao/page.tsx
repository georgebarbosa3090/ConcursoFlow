"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ChevronDown, ChevronRight } from "lucide-react";

export default function RevisaoEditalPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  
  // No mundo real, os dados viriam do estado global (Zustand) ou de uma query do banco/cache.
  // Aqui usamos o mock como exemplo.
  const dadosExtraidos = {
    concurso: "Polícia Federal - Agente",
    banca: "Cebraspe",
    cargo: "Agente de Polícia Federal",
    dataProva: "12/10/2026",
    disciplinas: [
      {
        nome: "Língua Portuguesa", peso: 1,
        topicos: ["Compreensão de textos", "Tipologia textual", "Ortografia", "Sintaxe"]
      },
      {
        nome: "Raciocínio Lógico", peso: 1.5,
        topicos: ["Lógica proposicional", "Diagramas", "Probabilidade"]
      },
      {
        nome: "Noções de Informática", peso: 1.5,
        topicos: ["Redes de Computadores", "Segurança da Informação", "Banco de Dados"]
      }
    ]
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleConfirmar = () => {
    // Aqui chamaria a API para persistir o plano definitivo.
    alert("Conteúdo programático salvo com sucesso!");
    router.push("/plano");
  };

  if (!isClient) return null;

  return (
    <MainLayout>
      <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3 text-green-600 bg-green-50 p-4 rounded-lg border border-green-200">
          <CheckCircle2 className="w-6 h-6" />
          <div>
            <h3 className="font-bold">Extração Concluída</h3>
            <p className="text-sm">O agente de IA analisou o edital com sucesso. Revise os dados abaixo.</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Informações Gerais</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-slate-500">Concurso</p>
              <p className="font-medium">{dadosExtraidos.concurso}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Banca</p>
              <p className="font-medium">{dadosExtraidos.banca}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Cargo</p>
              <p className="font-medium">{dadosExtraidos.cargo}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Data da Prova</p>
              <p className="font-medium">{dadosExtraidos.dataProva}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Conteúdo Programático Extraído</h2>
          <p className="text-sm text-slate-500 mb-6">Você pode revisar e editar as disciplinas e tópicos identificados antes de gerar seu plano de estudos.</p>
          
          <div className="space-y-4">
            {dadosExtraidos.disciplinas.map((disc, idx) => (
              <div key={idx} className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-50 px-4 py-3 flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <ChevronDown className="w-5 h-5 text-slate-500" />
                    <span className="font-bold text-slate-800">{disc.nome}</span>
                  </div>
                  <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">Peso {disc.peso}</span>
                </div>
                <div className="p-4 bg-white">
                  <ul className="space-y-2">
                    {disc.topicos.map((topico, tIdx) => (
                      <li key={tIdx} className="flex items-center gap-2 text-sm text-slate-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                        {topico}
                      </li>
                    ))}
                  </ul>
                  <button className="text-blue-600 text-sm font-medium mt-3 hover:underline">
                    + Adicionar Tópico Manualmente
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button className="px-6 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors font-medium">
            Descartar
          </button>
          <button 
            onClick={handleConfirmar}
            className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors font-medium shadow-sm">
            Confirmar e Gerar Itinerário
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
