import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import { 
  CalendarDays, CheckCircle2, TrendingUp, Target, 
  PlayCircle, Clock, BookOpen, FileText, ArrowRight, Bot
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const metrics = [
    { label: "Dias até a prova", value: "45", sub: "Polícia Federal 2026", color: "text-slate-900", icon: CalendarDays, bg: "bg-blue-50", iconColor: "text-blue-600" },
    { label: "Meta Semanal",     value: "75%", sub: "18h de 24h cumpridas",  color: "text-slate-900", icon: Target,     bg: "bg-purple-50", iconColor: "text-purple-600" },
    { label: "Questões Resolvidas", value: "1.204", sub: "Este mês: +312",   color: "text-slate-900", icon: CheckCircle2, bg: "bg-emerald-50", iconColor: "text-emerald-600" },
    { label: "Taxa de Acertos",  value: "82%",   sub: "↑ 4% vs. semana passada", color: "text-green-700", icon: TrendingUp, bg: "bg-green-50", iconColor: "text-green-600" },
  ];

  const sessoes = [
    { disciplina: "Direito Constitucional", topico: "Direitos Fundamentais", tipo: "Revisão", duracao: 45 },
    { disciplina: "Informática",            topico: "Redes TCP/IP",           tipo: "Questões", duracao: 30 },
  ];

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
            <div className="divide-y divide-slate-50">
              {sessoes.map((s, i) => (
                <div key={i} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      {s.tipo === "Questões" ? <FileText size={18} className="text-blue-600" /> : <BookOpen size={18} className="text-blue-600" />}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-900">{s.disciplina}</p>
                      <p className="text-xs text-slate-500">{s.topico} · {s.tipo} · {s.duracao}min</p>
                    </div>
                  </div>
                  <button className="flex items-center gap-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white px-3 py-1.5 rounded-lg transition">
                    <PlayCircle size={16} /> Iniciar
                  </button>
                </div>
              ))}
            </div>
            <div className="px-6 py-4">
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
              {[
                { nome: "Língua Portuguesa", pct: 65, cor: "bg-blue-500" },
                { nome: "Dir. Constitucional", pct: 28, cor: "bg-purple-500" },
                { nome: "Informática", pct: 80, cor: "bg-emerald-500" },
                { nome: "Raciocínio Lógico", pct: 42, cor: "bg-orange-500" },
              ].map(d => (
                <div key={d.nome} className="mb-3 last:mb-0">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-700 font-medium text-xs">{d.nome}</span>
                    <span className="text-slate-500 text-xs">{d.pct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full ${d.cor}`} style={{ width: `${d.pct}%` }} />
                  </div>
                </div>
              ))}
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
