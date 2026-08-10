"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock, CheckCircle, XCircle, BrainCircuit, Flag } from "lucide-react";

export default function ResolverQuestaoPage() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Questão mockada
  const questao = {
    disciplina: "Noções de Informática",
    assunto: "Redes de Computadores",
    banca: "Cebraspe",
    enunciado: "No modelo OSI (Open Systems Interconnection), o protocolo HTTP atua especificamente em qual camada responsável por prover serviços de rede diretamente aos aplicativos do usuário?",
    opcoes: [
      { id: 0, texto: "Camada de Rede" },
      { id: 1, texto: "Camada de Transporte" },
      { id: 2, texto: "Camada de Sessão" },
      { id: 3, texto: "Camada de Aplicação" },
      { id: 4, texto: "Camada de Apresentação" }
    ],
    correta: 3
  };

  const handleResponder = () => {
    if (selectedOption !== null) {
      setIsSubmitted(true);
    }
  };

  return (
    <MainLayout>
      <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium text-sm">
          <ArrowLeft size={16} /> Voltar para o Banco
        </button>

        <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex flex-wrap justify-between items-start gap-4 mb-6 pb-6 border-b border-slate-100">
            <div>
              <div className="flex gap-2 mb-2">
                <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded border border-blue-100">{questao.disciplina}</span>
                <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded">{questao.assunto}</span>
              </div>
              <p className="text-sm text-slate-400 font-medium">Questão Inédita • {questao.banca}</p>
            </div>
            <div className="flex items-center gap-2 text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
              <Clock size={16} />
              <span className="font-mono text-sm">01:45</span>
            </div>
          </div>

          <div className="prose prose-slate max-w-none mb-8">
            <p className="text-lg text-slate-800 leading-relaxed">{questao.enunciado}</p>
          </div>

          <div className="space-y-3">
            {questao.opcoes.map((opcao) => {
              const isSelected = selectedOption === opcao.id;
              const isCorrect = questao.correta === opcao.id;
              
              let styleClass = "border-slate-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer";
              let icon = null;

              if (isSubmitted) {
                if (isCorrect) {
                  styleClass = "border-green-500 bg-green-50 text-green-900";
                  icon = <CheckCircle className="text-green-500" size={20} />;
                } else if (isSelected && !isCorrect) {
                  styleClass = "border-red-500 bg-red-50 text-red-900";
                  icon = <XCircle className="text-red-500" size={20} />;
                } else {
                  styleClass = "border-slate-200 opacity-50 cursor-not-allowed";
                }
              } else if (isSelected) {
                styleClass = "border-blue-600 bg-blue-50 text-blue-900 ring-1 ring-blue-600";
              }

              return (
                <div 
                  key={opcao.id}
                  onClick={() => !isSubmitted && setSelectedOption(opcao.id)}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${styleClass}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold
                      ${isSubmitted ? (isCorrect ? 'border-green-500 text-green-500' : isSelected ? 'border-red-500 text-red-500' : 'border-slate-300 text-slate-400') 
                      : (isSelected ? 'border-blue-600 text-blue-600' : 'border-slate-300 text-slate-400')}
                    `}>
                      {String.fromCharCode(65 + opcao.id)}
                    </div>
                    <span className="font-medium">{opcao.texto}</span>
                  </div>
                  {icon}
                </div>
              );
            })}
          </div>

          {!isSubmitted ? (
            <div className="mt-8 flex justify-end border-t border-slate-100 pt-6">
              <button 
                onClick={handleResponder}
                disabled={selectedOption === null}
                className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Responder
              </button>
            </div>
          ) : (
            <div className="mt-8 pt-6 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                <div className="flex items-center gap-2 mb-3 text-blue-800">
                  <BrainCircuit size={20} />
                  <h3 className="font-bold text-lg">Comentário do Mentor IA</h3>
                </div>
                <p className="text-slate-700 leading-relaxed mb-4">
                  A resposta correta é a <strong>Alternativa D (Camada de Aplicação)</strong>. 
                  O modelo OSI possui 7 camadas (Física, Enlace, Rede, Transporte, Sessão, Apresentação e Aplicação). 
                  O HTTP (Hypertext Transfer Protocol) atua na 7ª camada, sendo responsável pela comunicação direta com os softwares navegadores (browsers).
                </p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-blue-200/50">
                  <span className="text-sm font-medium text-slate-500">Habilidade avaliada: Protocolos TCP/IP</span>
                  <button className="flex items-center gap-1 text-sm font-bold text-red-600 hover:text-red-700">
                    <Flag size={16} /> Adicionar ao Caderno de Erros
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
