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
        <div className="p-8 text-center max-w-2xl mx-auto mt-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Nenhum Edital Ativo</h2>
          <p className="text-slate-500 mb-6">Você precisa definir um edital como "Foco Atual" para gerar materiais específicos.</p>
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
