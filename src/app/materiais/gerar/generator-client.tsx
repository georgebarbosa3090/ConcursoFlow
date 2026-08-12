"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Bot, Sparkles, BookOpen } from "lucide-react";

type DataProps = {
  examTitle: string;
  board: string;
  subjects: {
    id: string;
    name: string;
    topics: { id: string; name: string; }[];
  }[];
};

export function GeneratorClient({ data }: { data: DataProps }) {
  const router = useRouter();
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const currentSubjectObj = data.subjects.find(s => s.id === selectedSubject);

  const handleGenerate = async () => {
    if (!selectedTopic || !currentSubjectObj) return;
    
    setIsLoading(true);
    setError("");

    const topicName = currentSubjectObj.topics.find(t => t.id === selectedTopic)?.name;

    try {
      const res = await fetch("/api/materiais/gerar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examTitle: data.examTitle,
          board: data.board,
          subjectName: currentSubjectObj.name,
          topicName: topicName
        })
      });

      if (!res.ok) {
        throw new Error("Falha ao gerar material");
      }

      const result = await res.json();
      router.push(`/materiais/ler/${result.materialId}`);
      
    } catch (err: any) {
      setError("Houve um erro ao se comunicar com a IA. Tente novamente.");
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-6">
      
      {/* Seleção de Disciplina */}
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">1. Escolha a Disciplina</label>
        <select
          value={selectedSubject}
          onChange={(e) => {
            setSelectedSubject(e.target.value);
            setSelectedTopic("");
          }}
          className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">Selecione...</option>
          {data.subjects.map(sub => (
            <option key={sub.id} value={sub.id}>{sub.name}</option>
          ))}
        </select>
      </div>

      {/* Seleção de Tópico */}
      {selectedSubject && currentSubjectObj && (
        <div className="animate-in fade-in slide-in-from-bottom-4">
          <label className="block text-sm font-bold text-slate-700 mb-2">2. Escolha o Assunto Específico</label>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Selecione o tópico...</option>
            {currentSubjectObj.topics.map(topic => (
              <option key={topic.id} value={topic.id}>{topic.name}</option>
            ))}
          </select>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Botão Gerar */}
      <div className="pt-6 border-t border-slate-100 mt-2">
        <button
          onClick={handleGenerate}
          disabled={!selectedTopic || isLoading}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-xl font-bold hover:opacity-90 transition disabled:opacity-50 shadow-md shadow-blue-500/20 text-lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={24} />
              Redigindo Material... (Isso pode levar alguns segundos)
            </>
          ) : (
            <>
              <Sparkles size={24} />
              Gerar Apostila Profunda
            </>
          )}
        </button>
        <p className="text-xs text-center text-slate-400 mt-4 flex items-center justify-center gap-1.5">
          <Bot size={14} />
          A IA aplicará regras de incidência e taxonomia da banca automaticamente.
        </p>
      </div>

    </div>
  );
}
