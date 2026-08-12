import { MainLayout } from "@/components/layout/main-layout";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { DesempenhoClient } from "./desempenho-client";
import { Target, TrendingUp, AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DesempenhoPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect("/login");
  }

  // Busca todas as respostas do usuário
  const userAnswers = await prisma.userAnswer.findMany({
    where: { userId: session.user.id },
    include: {
      question: {
        include: {
          topic: {
            include: {
              subject: true
            }
          }
        }
      }
    },
    orderBy: { createdAt: 'asc' }
  });

  const totalQuestions = userAnswers.length;
  const correctQuestions = userAnswers.filter(a => a.isCorrect).length;
  
  // Prontidão: Se não respondeu nada, 0%. Se respondeu, taxa de acerto. No mundo real, isso usaria TRI e Pesos.
  const prontidao = totalQuestions === 0 ? 0 : Math.round((correctQuestions / totalQuestions) * 100);

  // Agrupar por disciplina para o Gráfico Radar
  const subjectStats: Record<string, { total: number; correct: number }> = {};
  
  userAnswers.forEach(answer => {
    const subjectName = answer.question.topic?.subject?.name || "Geral";
    if (!subjectStats[subjectName]) {
      subjectStats[subjectName] = { total: 0, correct: 0 };
    }
    subjectStats[subjectName].total++;
    if (answer.isCorrect) subjectStats[subjectName].correct++;
  });

  const radarData = Object.keys(subjectStats).map(subject => {
    const accuracy = Math.round((subjectStats[subject].correct / subjectStats[subject].total) * 100);
    return {
      subject: subject.length > 15 ? subject.substring(0, 15) + '...' : subject,
      current: accuracy,
      goal: 85, // Meta fixa de 85% para aprovação de alto nível
      fullMark: 100
    };
  });

  // Se o usuário não tiver disciplinas suficientes, o radar ficará vazio, mas a UI cuida disso

  // Agrupar respostas por data (DD/MM) para o Gráfico de Evolução
  const evolutionMap: Record<string, { total: number; correct: number }> = {};
  
  userAnswers.forEach(answer => {
    const dateStr = answer.createdAt.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    if (!evolutionMap[dateStr]) {
      evolutionMap[dateStr] = { total: 0, correct: 0 };
    }
    evolutionMap[dateStr].total++;
    if (answer.isCorrect) evolutionMap[dateStr].correct++;
  });

  const evolutionData = Object.keys(evolutionMap).map(dateStr => {
    return {
      name: dateStr,
      acertos: Math.round((evolutionMap[dateStr].correct / evolutionMap[dateStr].total) * 100)
    };
  });

  if (evolutionData.length === 0) {
    evolutionData.push({ name: 'Hoje', acertos: 0 });
  }

  return (
    <MainLayout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Analytics e Desempenho</h2>
          <p className="text-slate-500">Acompanhe sua evolução baseada nas questões reais que você resolveu.</p>
        </div>

        {/* Readiness Index */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 md:p-8 text-white shadow-md flex flex-col md:flex-row items-center gap-8 justify-between">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2 text-blue-100 font-medium">
              <Target size={20} />
              Índice de Prontidão (Taxa Global de Acertos)
            </div>
            <div className="flex items-end gap-3">
              <h3 className="text-5xl font-bold">{prontidao}%</h3>
              <span className="mb-1 text-blue-200 text-sm">de {totalQuestions} questões resolvidas</span>
            </div>
            <p className="text-blue-100 max-w-md text-sm leading-relaxed">
              Sua pontuação é atualizada em tempo real conforme você resolve questões e acerta as miniavaliações geradas pela IA.
            </p>
          </div>
          <div className="w-full md:w-1/3 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20">
            <h4 className="font-bold text-sm mb-3">Fatores de Impacto</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-between">
                <span className="text-blue-100">Tendência Semanal</span>
                {totalQuestions > 0 ? (
                  <span className="text-green-300 font-bold flex items-center gap-1"><TrendingUp size={14}/> Positiva</span>
                ) : (
                  <span className="text-slate-300 font-bold flex items-center gap-1"><AlertCircle size={14}/> Estagnado</span>
                )}
              </li>
              <li className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
                <span className="text-blue-100">Meta do Edital</span>
                <span className="font-bold">85%</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Client Component with Recharts */}
        <DesempenhoClient radarData={radarData} evolutionData={evolutionData} />
      </div>
    </MainLayout>
  );
}
