import { MainLayout } from "@/components/layout/main-layout";
import { BookX, AlertTriangle, CalendarSync, BrainCircuit } from "lucide-react";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { RevisaoClient } from "./revisao-client";

export const dynamic = "force-dynamic";

export default async function CadernoErrosPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect("/login");
  }

  // Busca todos os erros do usuário
  const todosErros = await prisma.errorNotebookItem.findMany({
    where: { userId: session.user.id },
    include: {
      question: {
        include: {
          topic: { include: { subject: true } }
        }
      }
    }
  });

  const now = new Date();
  
  // Filtra o que precisa ser revisado hoje (nextReview <= agora)
  const pendentesHoje = todosErros.filter(e => e.nextReview <= now);
  const revisados = todosErros.filter(e => e.repetitions > 0);
  const futuros = todosErros.filter(e => e.nextReview > now);

  return (
    <MainLayout>
      <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BookX className="text-red-500" /> Revisão Espaçada Ativa
          </h2>
          <p className="text-slate-500 mt-1">
            Seu Caderno de Erros guiado por Inteligência Artificial (Algoritmo SM-2).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
            <div className="flex items-center gap-2 text-orange-600 font-bold mb-1">
              <AlertTriangle size={18} /> Revisões para Hoje
            </div>
            <span className="text-3xl font-bold text-orange-900">{pendentesHoje.length}</span>
            <p className="text-xs text-orange-700/70 mt-1">Flashcards aguardando você</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <div className="flex items-center gap-2 text-blue-600 font-bold mb-1">
              <CalendarSync size={18} /> Agendadas no Futuro
            </div>
            <span className="text-3xl font-bold text-blue-900">{futuros.length}</span>
            <p className="text-xs text-blue-700/70 mt-1">Memorização em andamento</p>
          </div>
          <div className="bg-green-50 p-4 rounded-xl border border-green-100">
            <div className="flex items-center gap-2 text-green-600 font-bold mb-1">
              <BrainCircuit size={18} /> Erros em Absorção
            </div>
            <span className="text-3xl font-bold text-green-900">{revisados.length}</span>
            <p className="text-xs text-green-700/70 mt-1">Retenção de memória aumentando</p>
          </div>
        </div>

        {pendentesHoje.length > 0 ? (
          <RevisaoClient pendentes={pendentesHoje} />
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <BrainCircuit size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Tudo em Dia! 🎉</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              Você não tem erros pendentes para revisar hoje. O algoritmo agendará automaticamente quando for o momento ideal para fortalecer sua memória.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
