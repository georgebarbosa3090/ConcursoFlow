"use client";

import { useState } from "react";
import { Search, Filter, RefreshCcw, X, FilterX } from "lucide-react";
import { useRouter } from "next/navigation";

export function FiltrosClient() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("objetivas");
  const [isExpanded, setIsExpanded] = useState(true);

  // Mock states for the applied filters
  const [appliedFilters, setAppliedFilters] = useState([
    { id: "disciplina", label: "Disciplina", value: "Raciocínio Lógico" },
    { id: "assunto", label: "Assunto", value: "Raciocínio Analítico" }
  ]);

  const handleRemoveFilter = (id: string) => {
    setAppliedFilters(prev => prev.filter(f => f.id !== id));
  };

  const handleFiltrar = () => {
    // Na vida real: router.push('/questoes?disciplina=x&assunto=y')
    alert("Filtros aplicados! (Simulação)");
  };

  if (!isExpanded) {
    return (
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Palavra Chave..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button 
          onClick={() => setIsExpanded(true)}
          className="flex items-center justify-center gap-2 px-6 py-2 bg-slate-100 text-slate-700 font-medium rounded-md hover:bg-slate-200 transition-colors border border-slate-300"
        >
          <Filter size={18} /> Mostrar Filtros Avançados
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl mb-8 overflow-hidden shadow-sm">
      {/* Tabs */}
      <div className="flex flex-wrap border-b border-slate-200 bg-white">
        <button 
          onClick={() => setActiveTab("objetivas")}
          className={`px-6 py-4 font-semibold text-sm flex items-center gap-2 transition-colors ${activeTab === 'objetivas' ? 'border-b-2 border-orange-500 text-slate-900' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
        >
          <div className={`w-4 h-1 rounded-sm ${activeTab === 'objetivas' ? 'bg-orange-500' : 'bg-slate-300'}`}></div>
          Questões Objetivas
        </button>
        <button 
          onClick={() => setActiveTab("discursivas")}
          className={`px-6 py-4 font-semibold text-sm flex items-center gap-2 transition-colors ${activeTab === 'discursivas' ? 'border-b-2 border-orange-500 text-slate-900' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
        >
          <div className="w-4 h-1 rounded-sm bg-slate-300"></div>
          Questões Discursivas
        </button>
        <button 
          onClick={() => setActiveTab("fixacao")}
          className={`px-6 py-4 font-semibold text-sm flex items-center gap-2 transition-colors ${activeTab === 'fixacao' ? 'border-b-2 border-orange-500 text-slate-900' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
        >
          <div className="w-4 h-1 rounded-sm bg-slate-300"></div>
          Exercícios de Fixação
        </button>
      </div>

      <div className="p-6 space-y-5">
        {/* Row 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3">
          <div className="md:col-span-1 relative flex">
            <input type="text" placeholder="Palavra Chave" className="w-full text-sm border-y border-l border-slate-300 rounded-l px-3 py-2 outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" />
            <button className="bg-blue-100 border-y border-r border-blue-200 px-3 flex items-center justify-center rounded-r hover:bg-blue-200 transition-colors">
              <Search size={16} className="text-blue-600" />
            </button>
          </div>
          <select className="md:col-span-1 text-sm border border-slate-300 rounded px-3 py-2 outline-none text-slate-700 bg-white shadow-sm">
            <option>Disciplina 1 selecionado</option>
          </select>
          <select className="md:col-span-1 text-sm border border-slate-300 rounded px-3 py-2 outline-none text-slate-700 bg-white shadow-sm">
            <option>Assunto 1 selecionado</option>
          </select>
          <select className="md:col-span-1 text-sm border border-slate-300 rounded px-3 py-2 outline-none text-slate-700 bg-white shadow-sm">
            <option>Banca</option>
            <option>Cebraspe</option>
            <option>FGV</option>
            <option>FCC</option>
          </select>
          <select className="md:col-span-1 text-sm border border-slate-300 rounded px-3 py-2 outline-none text-slate-700 bg-white shadow-sm">
            <option>Instituição</option>
          </select>
          <select className="md:col-span-1 text-sm border border-slate-300 rounded px-3 py-2 outline-none text-slate-700 bg-white shadow-sm">
            <option>Ano</option>
            <option>2026</option>
            <option>2025</option>
          </select>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3">
          <select className="md:col-span-1 text-sm border border-slate-300 rounded px-3 py-2 outline-none text-slate-700 bg-white shadow-sm">
            <option>Cargo</option>
          </select>
          <select className="md:col-span-1 text-sm border border-slate-300 rounded px-3 py-2 outline-none text-slate-700 bg-white shadow-sm">
            <option>Nível</option>
            <option>Superior</option>
            <option>Médio</option>
          </select>
          <select className="md:col-span-1 text-sm border border-slate-300 rounded px-3 py-2 outline-none text-slate-700 bg-white shadow-sm">
            <option>Área de Formação</option>
          </select>
          <select className="md:col-span-1 text-sm border border-slate-300 rounded px-3 py-2 outline-none text-slate-700 bg-white shadow-sm">
            <option>Área de Atuação</option>
          </select>
          <select className="md:col-span-1 text-sm border border-slate-300 rounded px-3 py-2 outline-none text-slate-700 bg-white shadow-sm">
            <option>Modalidade</option>
          </select>
          <select className="md:col-span-1 text-sm border border-slate-300 rounded px-3 py-2 outline-none text-slate-700 bg-white shadow-sm">
            <option>Dificuldade</option>
          </select>
        </div>

        {/* Checkboxes Row 1 */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mt-6 pt-4 border-t border-slate-200">
          <span className="font-bold text-sm text-slate-700 w-32">Excluir questões</span>
          <div className="flex flex-wrap gap-4 text-sm text-slate-500">
            <label className="flex items-center gap-2 cursor-pointer hover:text-slate-700">
              <input type="checkbox" className="rounded text-orange-500 focus:ring-orange-500 border-slate-300" /> Dos meus cadernos
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:text-slate-700">
              <input type="checkbox" className="rounded text-orange-500 focus:ring-orange-500 border-slate-300" /> Dos meus simulados
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:text-slate-700">
              <input type="checkbox" className="rounded text-orange-500 focus:ring-orange-500 border-slate-300" /> Inéditas
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:text-slate-700">
              <input type="checkbox" className="rounded text-orange-500 focus:ring-orange-500 border-slate-300" /> Anuladas
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:text-slate-700">
              <input type="checkbox" className="rounded text-orange-500 focus:ring-orange-500 border-slate-300" /> Desatualizadas
            </label>
          </div>
        </div>

        {/* Checkboxes Row 2 */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 pt-2">
          <span className="font-bold text-sm text-slate-700 w-32">Questões com</span>
          <div className="flex flex-wrap gap-4 text-sm text-slate-500">
            <label className="flex items-center gap-2 cursor-pointer hover:text-slate-700">
              <input type="checkbox" className="rounded text-orange-500 focus:ring-orange-500 border-slate-300" /> Gabarito Comentado
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:text-slate-700">
              <input type="checkbox" className="rounded text-orange-500 focus:ring-orange-500 border-slate-300" /> Comentários
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:text-slate-700">
              <input type="checkbox" className="rounded text-orange-500 focus:ring-orange-500 border-slate-300" /> Meus Comentários
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:text-slate-700">
              <input type="checkbox" className="rounded text-orange-500 focus:ring-orange-500 border-slate-300" /> Aulas
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:text-slate-700">
              <input type="checkbox" className="rounded text-orange-500 focus:ring-orange-500 border-slate-300" /> Minhas Anotações
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button 
            onClick={() => setIsExpanded(false)}
            className="text-slate-500 text-sm hover:text-slate-800 flex items-center gap-1"
          >
            Mostrar filtro simples <FilterX size={14} />
          </button>
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="bg-slate-100/50 border-t border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <span className="text-sm font-bold text-slate-700 shrink-0">Filtrar por:</span>
          {appliedFilters.length > 0 ? (
            appliedFilters.map(filter => (
              <div key={filter.id} className="flex items-center bg-white border border-slate-200 rounded text-sm shrink-0 shadow-sm overflow-hidden group">
                <div className="px-2 py-1 text-slate-500 font-medium bg-slate-50 border-r border-slate-200">{filter.label}</div>
                <div className="px-3 py-1 font-semibold text-slate-800">{filter.value}</div>
                <button 
                  onClick={() => handleRemoveFilter(filter.id)}
                  className="px-2 py-1 text-slate-400 hover:text-orange-500 hover:bg-orange-50 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ))
          ) : (
            <span className="text-sm text-slate-400 italic">Nenhum filtro aplicado.</span>
          )}
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto justify-end">
          <button className="text-orange-500 font-medium text-sm flex items-center gap-1 hover:text-orange-600 transition-colors">
            <Filter size={14} /> Salvar Filtros
          </button>
          <button 
            onClick={() => setAppliedFilters([])}
            className="text-blue-500 font-medium text-sm flex items-center gap-1 hover:text-blue-600 transition-colors"
          >
            <RefreshCcw size={14} /> Limpar
          </button>
          <button 
            onClick={handleFiltrar}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-2.5 rounded shadow-sm transition-colors"
          >
            Filtrar
          </button>
        </div>
      </div>
    </div>
  );
}
