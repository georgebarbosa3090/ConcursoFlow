import { MainLayout } from "@/components/layout/main-layout";
import { BookX, AlertTriangle, CalendarSync, BrainCircuit } from "lucide-react";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CadernoErrosPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect("/login");
  }

  // Busca os erros reais no banco de dados
  const erros = await prisma.errorNotebookItem.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
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
    }
  });

  return (
    <MainLayout>
      <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BookX className="text-red-500" /> Caderno Inteligente de Erros
          </h2>
          <p className="text-slate-500 mt-1">Seus erros transformados em estratégia. Revisite questões erradas para fechar lacunas.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-red-50 p-4 rounded-xl border border-red-100">
            <div className="flex items-center gap-2 text-red-600 font-bold mb-1">
              <AlertTriangle size={18} /> Erros Registrados
            </div>
            <span className="text-2xl font-bold text-red-900">{erros.length}</span>
            <p className="text-xs text-red-700/70 mt-1">Total acumulado</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
            <div className="flex items-center gap-2 text-orange-600 font-bold mb-1">
              <CalendarSync size={18} /> Revisões Pendentes
            </div>
            <span className="text-2xl font-bold text-orange-900">{erros.length}</span>
            <p className="text-xs text-orange-700/70 mt-1">Recomendado revisar esta semana</p>
          </div>
          <div className="bg-green-50 p-4 rounded-xl border border-green-100">
            <div className="flex items-center gap-2 text-green-600 font-bold mb-1">
              <BrainCircuit size={18} /> Erros Superados
            </div>
            <span className="text-2xl font-bold text-green-900">0</span>
            <p className="text-xs text-green-700/70 mt-1">Funcionalidade em breve</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Registros Recentes</h3>
          </div>
          
          <div className="divide-y divide-slate-100">
            {erros.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                Seu caderno está vazio. Excelente desempenho! 🎯
              </div>
            ) : (
              erros.map(erro => (
                <div key={erro.id} className="p-4 md:p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                    <div>
                      <div className="flex gap-2 mb-2">
                        <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-0.5 rounded border border-blue-100">
                          {erro.question.topic?.subject?.name || "Diversos"}
                        </span>
                        <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-0.5 rounded">
                          {erro.question.topic?.name || "Assunto Geral"}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 mb-1 line-clamp-1">{erro.question.text}</h4>
                      <p className="text-sm text-slate-500">Adicionado em {erro.createdAt.toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm mt-3 md:mt-0">
                      <Link 
                        href={`/questoes/resolver/${erro.questionId}`}
                        className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium whitespace-nowrap"
                      >
                        Refazer Questão
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
