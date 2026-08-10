import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ erro: "Não autenticado." }, { status: 401 });
    }

    const { questionId, selectedOption, isCorrect, timeSpent } = await req.json();

    if (!questionId || selectedOption === undefined) {
      return NextResponse.json({ erro: "Dados incompletos." }, { status: 400 });
    }

    // Salva a resposta do usuário
    const userAnswer = await prisma.userAnswer.create({
      data: {
        userId: session.user.id,
        questionId: questionId,
        selected: selectedOption,
        isCorrect: isCorrect,
        timeSpent: timeSpent || 0
      }
    });

    // Se errou, cria um item no Caderno de Erros
    if (!isCorrect) {
      await prisma.errorNotebookItem.create({
        data: {
          userId: session.user.id,
          questionId: questionId,
          errorType: "Erro Padrão (Revisão Necessária)", 
          note: "Gerado automaticamente por erro na questão."
        }
      });
    }

    return NextResponse.json({ sucesso: true, userAnswer });
  } catch (error) {
    console.error("Erro ao salvar resposta:", error);
    return NextResponse.json({ erro: "Falha ao processar a resposta." }, { status: 500 });
  }
}
