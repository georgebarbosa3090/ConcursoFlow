import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { calcularRevisao } from "@/lib/srs";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ erro: "Não autenticado." }, { status: 401 });
    }

    const { itemId, grade } = await req.json();

    if (!itemId || typeof grade !== 'number') {
      return NextResponse.json({ erro: "Dados incompletos." }, { status: 400 });
    }

    // Busca o item atual no Caderno de Erros
    const item = await prisma.errorNotebookItem.findUnique({
      where: { id: itemId, userId: session.user.id }
    });

    if (!item) {
      return NextResponse.json({ erro: "Item não encontrado." }, { status: 404 });
    }

    // Passa pelo algoritmo SRS
    const srsData = calcularRevisao(
      grade,
      item.interval,
      item.repetitions,
      item.easeFactor
    );

    // Atualiza o banco de dados
    const updatedItem = await prisma.errorNotebookItem.update({
      where: { id: itemId },
      data: {
        nextReview: srsData.nextReview,
        interval: srsData.interval,
        repetitions: srsData.repetitions,
        easeFactor: srsData.easeFactor,
        errorType: grade < 3 ? "Erro Padrão (Revisão Necessária)" : "Em Absorção"
      }
    });

    return NextResponse.json({ sucesso: true, nextReview: updatedItem.nextReview });
  } catch (error) {
    console.error("Erro na revisão SRS:", error);
    return NextResponse.json({ erro: "Falha ao processar revisão." }, { status: 500 });
  }
}
