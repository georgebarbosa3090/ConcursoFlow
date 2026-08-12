"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock, CheckCircle, XCircle, BrainCircuit, Flag, Loader2 } from "lucide-react";

type Opcao = {
  id: number;
  texto: string;
};

type Questao = {
  id: string;
  disciplina: string;
  assunto: string;
  banca: string;
  enunciado: string;
  opcoes: Opcao[];
  correta: number;
  explicacao: string;
};

export function ResolverClient({ questao }: { questao: Questao }) {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResponder = async () => {
    if (selectedOption === null) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/questoes/responder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: questao.id,
          selectedOption,
          isCorrect: selectedOption === questao.correta,
          timeSpent: 60 // hardcoded for now, idealmente contaria via timer no front
        })
      });
      
      if (res.ok) {
        setIsSubmitted(true);
      } else {
        alert("Falha ao registrar resposta no banco.");
      }
    } catch (e) {
      alert("Erro na conexão com o servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      <button onClick={() => router.push("/questoes")} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium text-sm">
        <ArrowLeft size={16} /> Voltar para o Banco
      </button>

      <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-wrap justify-between items-start gap-4 mb-6 pb-6 border-b border-slate-100">
          <div>
            <div className="flex gap-2 mb-2">
              <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded border border-blue-100">{questao.disciplina}</span>
              <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded">{questao.assunto}</span>
            </div>
            <p className="text-sm text-slate-400 font-medium">Banco de Questões • {questao.banca}</p>
          </div>
          <div className="flex items-center gap-2 text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
            <Clock size={16} />
            <span className="font-mono text-sm">Praticando...</span>
          </div>
        </div>

        <div className="prose prose-slate max-w-none mb-8">
          <p className="text-lg text-slate-800 leading-relaxed">{questao.enunciado}</p>
        </div>

        <div className="space-y-3">
          {questao.opcoes.map((opcao) => {
            const isSelected = selectedOption === opcao.id;
            const isCorrect = questao.correta === opcao.id;
            
            let styleClass = "border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 cursor-pointer shadow-sm hover:shadow-md";
            let icon = null;

            if (isSubmitted) {
              if (isCorrect) {
                styleClass = "border-green-500 bg-green-50/80 text-green-900 shadow-md ring-1 ring-green-500/50";
                icon = <CheckCircle className="text-green-600 drop-shadow-sm" size={22} />;
              } else if (isSelected && !isCorrect) {
                styleClass = "border-red-500 bg-red-50/80 text-red-900 shadow-md ring-1 ring-red-500/50 opacity-90";
                icon = <XCircle className="text-red-600 drop-shadow-sm" size={22} />;
              } else {
                styleClass = "border-slate-200 bg-slate-50/50 opacity-50 cursor-not-allowed";
              }
            } else if (isSelected) {
              styleClass = "border-blue-500 bg-blue-50/80 text-blue-900 shadow-md ring-1 ring-blue-500/50 scale-[1.01]";
            }

            return (
              <div 
                key={opcao.id}
                onClick={() => !isSubmitted && setSelectedOption(opcao.id)}
                className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 ease-in-out ${styleClass}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 shadow-sm
                    ${isSubmitted ? (isCorrect ? 'border-green-500 text-green-600 bg-white' : isSelected ? 'border-red-500 text-red-600 bg-white' : 'border-slate-300 text-slate-400 bg-white') 
                    : (isSelected ? 'border-blue-500 text-blue-600 bg-white' : 'border-slate-300 text-slate-400 bg-white')}
                  `}>
                    {String.fromCharCode(65 + opcao.id)}
                  </div>
                  <span className="font-medium text-slate-700">{opcao.texto}</span>
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
              disabled={selectedOption === null || isSubmitting}
              className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting && <Loader2 size={18} className="animate-spin" />}
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
                {questao.explicacao}
              </p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-blue-200/50">
                <span className="text-sm font-medium text-slate-500">Desempenho salvo na sua conta.</span>
                {selectedOption !== questao.correta && (
                   <span className="flex items-center gap-1 text-sm font-bold text-red-600">
                     <Flag size={16} /> Adicionado ao Caderno de Erros
                   </span>
                )}
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
               <button onClick={() => router.push("/questoes")} className="px-6 py-2.5 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors">
                 Próxima Questão
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
