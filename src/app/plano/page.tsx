import { MainLayout } from "@/components/layout/main-layout";
import { Calendar, PlayCircle, Clock, BookOpen, AlertCircle, FileText } from "lucide-react";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getOrGeneratePlan } from "@/lib/plan";

export const dynamic = "force-dynamic";

export default async function ItinerarioPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect("/login");
  }
  
  // Buscar os concursos do usuário com as disciplinas e tópicos
  const exams = await prisma.exam.findMany({
    where: { userId: session.user.id },
    include: {
      subjects: {
        include: {
          topics: true
        }
      }
    }
  });

  const exam = exams.length > 0 ? exams[0] : null;

  let sessoesDeHoje: any[] = [];
  let sessoesAmanha: any[] = [];
  let todasSessoes: any[] = [];
  
  if (exam) {
    const planoReal = await getOrGeneratePlan(session.user.id, exam.id);
    if (planoReal && planoReal.sessions) {
      todasSessoes = planoReal.sessions;
      
      const hoje = new Date();
      hoje.setHours(0,0,0,0);
      
      const amanha = new Date(hoje);
      amanha.setDate(amanha.getDate() + 1);
      
      const depois = new Date(hoje);
      depois.setDate(depois.getDate() + 2);

      // Filtra sessões do dia atual
      sessoesDeHoje = planoReal.sessions.filter(s => {
        const d = new Date(s.date);
        return d >= hoje && d < amanha;
      }).map((s, i) => ({
        id: s.id,
        disciplina: s.type.split(" - ")[1]?.split(":")[0] || "Disciplina",
        topico: s.type.split(": ")[1] || s.type,
        tipo: s.type.split(" - ")[0],
        duracao: s.duration,
        status: s.status === "PENDING" ? "Pendente" : "Concluído",
        cor: i === 0 ? "bg-blue-100 text-blue-700 border-blue-200" : (i === 1 ? "bg-purple-100 text-purple-700 border-purple-200" : "bg-orange-100 text-orange-700 border-orange-200"),
        icone: i === 0 ? BookOpen : (i === 1 ? FileText : AlertCircle)
      }));

      // Filtra sessões de amanhã para mostrar como "Próximos passos"
      sessoesAmanha = planoReal.sessions.filter(s => {
        const d = new Date(s.date);
        return d >= amanha && d < depois;
      });
    }
  }

  return (
    <MainLayout>
      <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Meu Itinerário</h2>
            <p className="text-slate-500">
              {exam ? `Seu plano adaptativo para ${exam.title}.` : "Importe um edital para gerar seu plano."}
            </p>
          </div>
          <Link href="/disponibilidade" className="text-sm font-medium text-blue-600 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors flex items-center gap-2">
            <Clock size={16} /> Ajustar Disponibilidade
          </Link>
        </div>

        {sessoesDeHoje.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border border-slate-200">
            <p className="text-slate-500 mb-4">Você ainda não tem um edital configurado para gerar sessões.</p>
            <Link href="/concursos" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700">
              Escolher Concurso
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg text-slate-900">Sessões de Hoje</h3>
                  <span className="text-sm font-medium text-slate-500">
                    Total: {sessoesDeHoje.reduce((acc, s) => acc + s.duracao, 0)} min
                  </span>
                </div>
                
                <div className="space-y-4">
                  {sessoesDeHoje.map(sessao => {
                    const Icone = sessao.icone;
                    return (
                      <div key={sessao.id} className="group border border-slate-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white cursor-pointer">
                        <div className="flex gap-4 items-center">
                          <div className={`p-3 rounded-lg border ${sessao.cor}`}>
                            <Icone size={24} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{sessao.tipo}</span>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">{sessao.duracao} min</span>
                              {sessao.status === "Atrasado" && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-bold">Atrasado</span>
                              )}
                            </div>
                            <h4 className="font-bold text-slate-900">{sessao.disciplina}</h4>
                            <p className="text-sm text-slate-500 line-clamp-1">{sessao.topico}</p>
                          </div>
                        </div>
                        
                        <Link href="/questoes/resolver/first-available" className="w-full md:w-auto mt-4 md:mt-0 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 font-medium rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <PlayCircle size={18} /> Iniciar
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-700 to-indigo-800 p-6 rounded-2xl shadow-xl shadow-indigo-900/20 text-white flex items-start gap-5 border border-indigo-500/30">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 blur-3xl rounded-full pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-indigo-400/20 blur-3xl rounded-full pointer-events-none"></div>
                <div className="relative z-10 p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10 shrink-0 shadow-inner">
                  <BrainCircuit size={28} className="text-indigo-100" />
                </div>
                <div className="relative z-10 flex-1">
                  <h3 className="font-extrabold text-lg mb-1.5 tracking-tight text-white drop-shadow-sm">Recalibração Automática de IA</h3>
                  <p className="text-sm text-indigo-100/90 leading-relaxed mb-5 font-medium">O motor adaptativo identificou baixo desempenho recente em <span className="text-white font-bold bg-white/10 px-1.5 py-0.5 rounded">{sessoesDeHoje[0]?.disciplina || "sua última sessão"}</span>. Substituímos a revisão planejada de hoje por um bloco focado nesse assunto crítico.</p>
                  <button className="text-xs font-bold uppercase tracking-wider px-4 py-2 bg-white text-indigo-700 hover:bg-indigo-50 rounded-lg shadow-md transition-all active:scale-95 flex items-center gap-2">
                    Ver Relatório Detalhado
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="text-slate-400" size={20} />
                  <h3 className="font-bold text-slate-900">Ciclo Semanal</h3>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {['D','S','T','Q','Q','S','S'].map((dia, i) => (
                    <div key={i} className="text-xs font-medium text-slate-400 mb-2">{dia}</div>
                  ))}
                  {[...Array(28)].map((_, i) => (
                    <div key={i} className={`h-8 rounded-full flex items-center justify-center text-sm ${i === 12 ? 'bg-blue-600 text-white font-bold shadow-md' : i < 12 ? 'bg-green-100 text-green-700' : 'hover:bg-slate-100 text-slate-600'}`}>
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4">Cobertura do Edital</h3>
                <div className="space-y-5">
                  {exam.subjects.slice(0, 3).map((sub, i) => {
                    const pct = [45, 22, 8][i] || 0;
                    const colors = ["bg-blue-500", "bg-purple-500", "bg-indigo-500"];
                    return (
                      <div key={sub.id}>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="font-medium text-slate-700 truncate mr-2">{sub.name}</span>
                          <span className="text-slate-500 font-bold">{pct}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div className={`${colors[i % colors.length]} h-2 rounded-full transition-all`} style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

// Simple Brain icon component for the inline SVG since we don't import BrainCircuit at top
function BrainCircuit(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
      <path d="M9 13a4.5 4.5 0 0 0 3-4" />
      <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
      <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
      <path d="M6 18a4 4 0 0 1-1.967-.516" />
      <path d="M12 13h4" />
      <path d="M12 18h6a2 2 0 0 1 2 2v1" />
      <path d="M12 8h8" />
      <path d="M16 8V5a2 2 0 0 1 2-2" />
      <circle cx="16" cy="13" r=".5" />
      <circle cx="18" cy="3" r=".5" />
      <circle cx="20" cy="21" r=".5" />
      <circle cx="20" cy="8" r=".5" />
    </svg>
  );
}
