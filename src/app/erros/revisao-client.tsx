"use client";

import { useState } from "react";
import { BrainCircuit, Loader2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export function RevisaoClient({ pendentes }: { pendentes: any[] }) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const item = pendentes[currentIndex];

  if (!item) return null; // Prevenção de erro caso zere

  const questao = item.question;
  const opcoes = questao.options.map((t: string, i: number) => ({ id: i, texto: t }));

  const handleAvaliar = async (grade: number) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/revisao/avaliar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: item.id, grade })
      });
      
      if (res.ok) {
        if (currentIndex < pendentes.length - 1) {
          setCurrentIndex(prev => prev + 1);
          setShowAnswer(false);
        } else {
          // Finalizou o deck de hoje
          router.refresh();
        }
      } else {
        alert("Erro ao salvar avaliação.");
      }
    } catch {
      alert("Falha de conexão com servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border-2 border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-sm font-medium text-slate-500">
        <span>Cartão {currentIndex + 1} de {pendentes.length}</span>
        <span className="flex items-center gap-1"><BrainCircuit size={16}/> Algoritmo Ativo</span>
      </div>
      
      <div className="p-6 md:p-8">
        <div className="flex gap-2 mb-4">
          <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-0.5 rounded border border-blue-100">
            {questao.topic?.subject?.name || "Geral"}
          </span>
          <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-0.5 rounded">
            {questao.topic?.name || "Geral"}
          </span>
        </div>

        <p className="text-lg text-slate-800 leading-relaxed mb-6 font-medium">
          {questao.text}
        </p>

        <div className="space-y-3 mb-8">
          {opcoes.map((opcao: any) => {
            const isCorrect = questao.correctOption === opcao.id;
            let style = "border-slate-200";
            
            if (showAnswer) {
              if (isCorrect) style = "border-green-500 bg-green-50 text-green-900";
              else style = "border-slate-200 opacity-50";
            }

            return (
              <div key={opcao.id} className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${style}`}>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0
                  ${showAnswer && isCorrect ? 'border-green-500 text-green-500' : 'border-slate-300 text-slate-400'}
                `}>
                  {String.fromCharCode(65 + opcao.id)}
                </div>
                <span className="font-medium text-slate-700">{opcao.texto}</span>
              </div>
            );
          })}
        </div>

        {!showAnswer ? (
          <button 
            onClick={() => setShowAnswer(true)}
            className="w-full py-4 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors shadow-sm text-lg"
          >
            Mostrar Resposta
          </button>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {questao.explanation && (
              <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 mb-6 text-sm text-blue-900">
                <span className="font-bold flex items-center gap-1 mb-1"><BrainCircuit size={14}/> Comentário da IA:</span>
                {questao.explanation}
              </div>
            )}
            
            <h4 className="font-bold text-center text-slate-800 mb-3">Como foi resolver essa questão hoje?</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button onClick={() => handleAvaliar(1)} disabled={isSubmitting} className="py-3 px-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-bold rounded-lg transition-colors flex flex-col items-center gap-1 disabled:opacity-50">
                <span className="text-lg">🥵</span> Errei de Novo
              </button>
              <button onClick={() => handleAvaliar(3)} disabled={isSubmitting} className="py-3 px-2 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-700 font-bold rounded-lg transition-colors flex flex-col items-center gap-1 disabled:opacity-50">
                <span className="text-lg">🤔</span> Difícil (Acertou)
              </button>
              <button onClick={() => handleAvaliar(4)} disabled={isSubmitting} className="py-3 px-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-bold rounded-lg transition-colors flex flex-col items-center gap-1 disabled:opacity-50">
                <span className="text-lg">😎</span> Bom
              </button>
              <button onClick={() => handleAvaliar(5)} disabled={isSubmitting} className="py-3 px-2 bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 font-bold rounded-lg transition-colors flex flex-col items-center gap-1 disabled:opacity-50">
                <span className="text-lg">🚀</span> Muito Fácil
              </button>
            </div>
            {isSubmitting && <div className="mt-4 flex justify-center text-slate-400"><Loader2 className="animate-spin" /></div>}
          </div>
        )}
      </div>
    </div>
  );
}
