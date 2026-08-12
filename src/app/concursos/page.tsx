import { MainLayout } from "@/components/layout/main-layout";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Search, Building2, Calendar, FileText, ChevronRight, MapPin, Users } from "lucide-react";
import prisma from "@/lib/prisma";

export default async function ConcursosPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect("/login");
  }

  // Buscar concursos que o usuário já está matriculado/criou
  const meusConcursos = await prisma.exam.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' }
  });

  // Mocks de concursos populares em aberto para simular um "Marketplace" de editais
  const concursosDestaque = [
    {
      id: "mock-1",
      title: "Tribunal de Contas do Estado (TCE-MA)",
      board: "Fundação Getulio Vargas (FGV)",
      status: "Edital Publicado",
      statusColor: "bg-blue-100 text-blue-700",
      vagas: 115,
      salario: "R$ 10.423,00",
      dataProva: "A definir",
      local: "Maranhão",
      disciplinas: ["Auditoria Governamental", "Contabilidade Pública", "Controle Externo", "AFO"]
    },
    {
      id: "mock-2",
      title: "Tribunal de Contas da União (TCU)",
      board: "Cebraspe",
      status: "Autorizado",
      statusColor: "bg-orange-100 text-orange-700",
      vagas: 150,
      salario: "R$ 24.321,56",
      dataProva: "Previsto",
      local: "Nacional",
      disciplinas: ["Auditoria Governamental", "Controle Externo", "Análise de Dados", "AFO"]
    },
    {
      id: "mock-3",
      title: "Controladoria-Geral da União (CGU)",
      board: "FGV",
      status: "Em Estudo",
      statusColor: "bg-slate-100 text-slate-600",
      vagas: 300,
      salario: "R$ 20.924,80",
      dataProva: "Sem Previsão",
      local: "Nacional",
      disciplinas: ["Auditoria Governamental", "Finanças Públicas", "Combate à Corrupção", "Contabilidade Pública"]
    },
    {
      id: "mock-4",
      title: "Concurso Nacional Unificado (CNU) - Bloco 8",
      board: "Fundação Cesgranrio",
      status: "Inscrições Abertas",
      statusColor: "bg-green-100 text-green-700",
      vagas: 692,
      salario: "R$ 7.436,29",
      dataProva: "05/05/2026",
      local: "Nacional",
      disciplinas: ["Língua Portuguesa", "Noções de Direito", "Realidade Brasileira", "Matemática"]
    }
  ];

  return (
    <MainLayout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-10">
        
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Painel de Concursos</h2>
            <p className="text-slate-500 mt-1">Explore editais em aberto ou importe um novo para iniciar seus estudos.</p>
          </div>
          <Link href="/concursos/novo" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2">
            <FileText size={18} /> + Importar Edital Próprio
          </Link>
        </div>

        {/* Busca e Filtros Rápida */}
        <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Buscar concurso, banca ou cargo..." 
              className="w-full pl-12 pr-4 py-3 bg-transparent outline-none text-slate-700 placeholder-slate-400"
            />
          </div>
          <div className="flex gap-2 p-1 border-t md:border-t-0 md:border-l border-slate-100">
            <button className="px-4 py-2 text-sm font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap">Nível Médio</button>
            <button className="px-4 py-2 text-sm font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap">Tribunais</button>
            <button className="px-4 py-2 text-sm font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap">Policiais</button>
          </div>
        </div>

        {/* Meus Concursos (Do Banco de Dados) */}
        {meusConcursos.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-xl font-bold text-slate-800">Meus Estudos Ativos</h3>
              <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">{meusConcursos.length}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {meusConcursos.map(concurso => (
                <div key={concurso.id} className="bg-white p-5 rounded-2xl border border-blue-200 shadow-[0_4px_20px_-4px_rgba(59,130,246,0.1)] hover:shadow-[0_8px_30px_-4px_rgba(59,130,246,0.15)] transition-all group flex flex-col h-full relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-10 group-hover:bg-blue-100 transition-colors"></div>
                  
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-md">
                      Em Andamento
                    </span>
                  </div>
                  
                  <h4 className="font-bold text-lg text-slate-900 leading-tight mb-2 line-clamp-2">
                    {concurso.title}
                  </h4>
                  
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                    <Building2 size={16} />
                    <span>{concurso.board || "Banca não informada"}</span>
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-slate-100">
                    <Link href="/plano" className="flex items-center justify-between text-blue-600 font-bold hover:text-blue-800 transition-colors">
                      Acessar Plano de Estudos
                      <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Vitrine de Concursos */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-800">Editais em Destaque</h3>
            <button className="text-blue-600 text-sm font-medium hover:underline">Ver todos</button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {concursosDestaque.map(concurso => (
              <div key={concurso.id} className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-300 shadow-sm transition-all flex flex-col sm:flex-row gap-5 items-start">
                
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${concurso.statusColor}`}>
                      {concurso.status}
                    </span>
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md flex items-center gap-1">
                      <MapPin size={12} /> {concurso.local}
                    </span>
                  </div>
                  
                  <h4 className="font-bold text-lg text-slate-900 leading-snug">
                    {concurso.title}
                  </h4>
                  
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Building2 size={16} className="text-slate-400" />
                      <span>{concurso.board}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users size={16} className="text-slate-400" />
                      <span>{concurso.vagas} vagas</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium text-emerald-600">
                      <span>{concurso.salario}</span>
                    </div>
                  </div>
                  
                  {/* Disciplinas Específicas */}
                  {concurso.disciplinas && (
                    <div className="pt-3 border-t border-slate-100">
                      <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Matérias Foco (Auditoria)</p>
                      <div className="flex flex-wrap gap-1.5">
                        {concurso.disciplinas.map((disc, idx) => (
                          <span key={idx} className="bg-slate-50 border border-slate-200 text-slate-600 text-xs font-medium px-2 py-0.5 rounded-md">
                            {disc}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="w-full sm:w-auto flex flex-col gap-3 sm:items-end">
                  <div className="text-left sm:text-right">
                    <p className="text-xs text-slate-400 font-medium">Data da Prova</p>
                    <p className="text-sm font-bold text-slate-700 flex items-center gap-1.5 sm:justify-end mt-0.5">
                      <Calendar size={14} /> {concurso.dataProva}
                    </p>
                  </div>
                  <button className="w-full sm:w-auto px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-colors shadow-sm">
                    Ver Detalhes
                  </button>
                </div>

              </div>
            ))}
          </div>
        </section>

      </div>
    </MainLayout>
  );
}
