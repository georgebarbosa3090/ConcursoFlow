"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function GerarQuestoesBtn() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGerar = async () => {
    // Para simplificar, estamos hardcodando banca e disciplina no exemplo
    // No app real, isso viria de um modal onde o usuário escolhe
    const banca = prompt("Qual banca? (ex: CEBRASPE, FGV)", "CEBRASPE");
    if (!banca) return;
    
    const disciplina = prompt("Qual disciplina? (ex: Português, Direito Constitucional)", "Direito Constitucional");
    if (!disciplina) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/questoes/gerar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ board: banca, subjectName: disciplina, quantidade: 2 })
      });
      
      if (res.ok) {
        alert("Questões geradas com sucesso! A página será atualizada.");
        router.refresh();
      } else {
        alert("Erro ao gerar questões com a IA.");
      }
    } catch (error) {
      alert("Falha na comunicação com a API.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleGerar}
      disabled={isLoading}
      className="text-sm font-medium text-white bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-70"
    >
      {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
      Gerar Questões (IA)
    </button>
  );
}
