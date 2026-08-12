import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import { 
  CalendarDays, CheckCircle2, TrendingUp, Target, 
  PlayCircle, Clock, BookOpen, FileText, ArrowRight, Bot,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import prisma from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) redirect("/login");

  // Fetch real data
  const userAnswers = await prisma.userAnswer.findMany({
    where: { userId: session.user.id }
  });

  const totalResolvidas = userAnswers.length;
  const corretas = userAnswers.filter(a => a.isCorrect).length;
  const taxaAcerto = totalResolvidas > 0 ? Math.round((corretas / totalResolvidas) * 100) : 0;

  // Busca o concurso ativo (Foco Atual) e o seu respectivo plano de estudos
  const activeExam = await prisma.exam.findFirst({
    where: { userId: session.user.id },
    orderBy: { updatedAt: 'desc' }
  });

  const plan = activeExam ? await prisma.studyPlan.findFirst({
    where: { userId: session.user.id, examId: activeExam.id },
    include: {
      exam: true,
      sessions: {
        where: {
          date: {
            gte: new Date(new Date().setHours(0,0,0,0)),
            lt: new Date(new Date().setHours(23,59,59,999))
          }
        },
        orderBy: { date: 'asc' }
      }
    }
  }) : null;

  const sessoes = plan?.sessions || [];
  const exam = plan?.exam;
  const diasAteProva = "A definir"; // We don't have exam date in schema yet

  const metrics = [
    { label: "Dias até a prova", value: exam ? diasAteProva : "-", sub: exam?.title || "Nenhum edital ativo", color: "text-slate-900", icon: CalendarDays, bg: "bg-blue-50", iconColor: "text-blue-600" },
    { label: "Meta Semanal",     value: sessoes.length > 0 ? "Em andamento" : "0%", sub: `${sessoes.length} sessões hoje`,  color: "text-slate-900", icon: Target,     bg: "bg-purple-50", iconColor: "text-purple-600" },
    { label: "Questões Resolvidas", value: totalResolvidas.toString(), sub: "Total histórico",   color: "text-slate-900", icon: CheckCircle2, bg: "bg-emerald-50", iconColor: "text-emerald-600" },
    { label: "Taxa de Acertos",  value: `${taxaAcerto}%`,   sub: totalResolvidas > 0 ? "Global" : "Faça questões", color: taxaAcerto > 70 ? "text-green-700" : "text-orange-600", icon: TrendingUp, bg: taxaAcerto > 70 ? "bg-green-50" : "bg-orange-50", iconColor: taxaAcerto > 70 ? "text-green-600" : "text-orange-600" },
  ];

  // Dynamic Subject Progress
  const subjectStats: Record<string, { total: number; correct: number }> = {};
  
  const answersWithTopics = await prisma.userAnswer.findMany({
    where: { userId: session.user.id },
    include: { question: { include: { topic: { include: { subject: true } } } } }
  });

  answersWithTopics.forEach(answer => {
    const subjectName = answer.question.topic?.subject?.name || "Geral";
    if (!subjectStats[subjectName]) {
      subjectStats[subjectName] = { total: 0, correct: 0 };
    }
    subjectStats[subjectName].total++;
    if (answer.isCorrect) subjectStats[subjectName].correct++;
  });

  const progressData = Object.keys(subjectStats).map((nome, index) => {
    const pct = Math.round((subjectStats[nome].correct / subjectStats[nome].total) * 100);
    const colors = ["bg-blue-500", "bg-purple-500", "bg-emerald-500", "bg-orange-500"];
    return { nome: nome.length > 15 ? nome.substring(0, 15) + '...' : nome, pct, cor: colors[index % colors.length] };
  });

  return (
    <MainLayout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Olá, {session.user?.name?.split(" ")[0] || "Estudante"} 👋
            </h2>
            <p className="text-slate-500 mt-1">Bem-vindo(a) de volta! Aqui está o resumo da sua preparação.</p>
          </div>
          <Link href="/agente-bancas" className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium hover:opacity-90 transition shadow-md shadow-blue-500/20">
            <Bot size={18} /> Agente Bancas
          </Link>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m) => (
            <div key={m.label} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className={`w-10 h-10 ${m.bg} rounded-lg flex items-center justify-center mb-3`}>
                <m.icon size={20} className={m.iconColor} />
              </div>
              <p className={`text-2xl font-extrabold ${m.color}`}>{m.value}</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">{m.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{m.sub}</p>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sessões do dia */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">Sessões de Hoje</h3>
              <Link href="/plano" className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1">
                Ver Itinerário <ArrowRight size={14} />
              </Link>
            </div>
            
            {sessoes.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <p>Nenhuma sessão programada para hoje.</p>
                {!exam && (
                  <Link href="/concursos" className="text-blue-600 font-medium hover:underline mt-2 inline-block">
                    Importe um edital para gerar seu plano
                  </Link>
                )}
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {sessoes.map((s) => {
                  const disciplina = s.type.split(" - ")[1]?.split(":")[0] || "Disciplina";
                  const topico = s.type.split(": ")[1] || s.type;
                  const tipo = s.type.split(" - ")[0];

                  return (
                    <div key={s.id} className="flex flex-col md:flex-row md:items-center justify-between px-6 py-4 hover:bg-slate-50 transition group gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                          {tipo.includes("Questões") ? <FileText size={18} className="text-blue-600" /> : <BookOpen size={18} className="text-blue-600" />}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-900">{disciplina}</p>
                          <p className="text-xs text-slate-500 line-clamp-1">{topico} · {tipo} · {s.duration}min</p>
                        </div>
                      </div>
                      <Link href="/questoes/resolver/first-available" className="flex items-center justify-center gap-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white px-3 py-1.5 rounded-lg transition whitespace-nowrap">
                        <PlayCircle size={16} /> Iniciar
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
            
            <div className="px-6 py-4 border-t border-slate-50">
              <Link href="/plano" className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition">
                <Clock size={16} /> Ver plano completo do dia
              </Link>
            </div>
          </div>

          {/* Side widgets */}
          <div className="space-y-4">
            {/* Progresso por disciplina */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4">Progresso por Disciplina</h3>
              {progressData.length === 0 ? (
                <div className="text-center text-sm text-slate-500 py-4">
                  Responda questões para gerar seu progresso.
                </div>
              ) : (
                progressData.map(d => (
                  <div key={d.nome} className="mb-3 last:mb-0">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-700 font-medium text-xs">{d.nome}</span>
                      <span className="text-slate-500 text-xs">{d.pct}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full ${d.cor}`} style={{ width: `${d.pct}%` }} />
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Agente Bancas CTA */}
            <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-5 rounded-xl text-white shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <Bot size={20} />
                <h3 className="font-bold">Agente Especialista</h3>
              </div>
              <p className="text-sm text-indigo-100 mb-4">Tire dúvidas sobre estilo de prova, matérias e estratégias específicas da sua banca.</p>
              <Link href="/agente-bancas" className="flex items-center gap-2 text-sm font-bold bg-white/20 hover:bg-white/30 transition px-3 py-2 rounded-lg">
                Conversar com o Agente <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
