import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ResolverClient } from "./resolver-client";
import { MainLayout } from "@/components/layout/main-layout";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ResolverPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/login");
  }

  const question = await prisma.question.findUnique({
    where: { id: params.id },
    include: { topic: { include: { subject: true } } }
  });

  if (!question) {
    notFound();
  }

  // Prepara dados formatados para o Client Component
  const formattedQuestion = {
    id: question.id,
    disciplina: question.topic?.subject?.name || "Diversos",
    assunto: question.topic?.name || "Assunto Geral",
    banca: question.board || "Diversas",
    enunciado: question.text,
    opcoes: question.options.map((texto, index) => ({
      id: index,
      texto
    })),
    correta: question.correctOption,
    explicacao: question.explanation || "Esta questão não possui comentários da IA."
  };

  return (
    <MainLayout>
      <ResolverClient questao={formattedQuestion} />
    </MainLayout>
  );
}
