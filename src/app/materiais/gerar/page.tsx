import { MainLayout } from "@/components/layout/main-layout";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { GeneratorClient } from "./generator-client";

export default async function GerarMaterialPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect("/login");
  }

  // Busca o edital ativo do usuário e as disciplinas
  const activeExam = await prisma.exam.findFirst({
    where: { userId: session.user.id },
    orderBy: { updatedAt: 'desc' },
    include: {
      subjects: {
        include: {
          topics: true
        }
      }
    }
  });

  if (!activeExam) {
    return (
      <MainLayout>
        <div className="p-8 text-center max-w-2xl mx-auto mt-10 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Nenhum Edital Ativo</h2>
          <p className="text-slate-500 mb-6">Para gerar uma apostila específica com Inteligência Artificial, você precisa primeiro importar um edital e definir as disciplinas-alvo.</p>
          <a href="/concursos/novo" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition">
            Importar Meu Primeiro Edital
          </a>
        </div>
      </MainLayout>
    );
  }

  // Prepara estrutura limpa para o cliente
  const data = {
    examTitle: activeExam.title,
    board: activeExam.board || "Não definida",
    subjects: activeExam.subjects.map(s => ({
      id: s.id,
      name: s.name,
      topics: s.topics.map(t => ({ id: t.id, name: t.name }))
    }))
  };

  return (
    <MainLayout>
      <div className="p-6 md:p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Gerador de Apostila IA</h2>
          <p className="text-slate-500 mt-2">
            Baseado no seu foco atual: <strong className="text-slate-700">{data.examTitle} ({data.board})</strong>
          </p>
        </div>

        <GeneratorClient data={data} />
      </div>
    </MainLayout>
  );
}
