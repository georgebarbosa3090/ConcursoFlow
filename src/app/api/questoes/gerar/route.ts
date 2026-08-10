import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { gerarNovasQuestoes } from "@/lib/ai";

export const maxDuration = 60; // Limite maior para geração na Vercel

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ erro: "Não autenticado." }, { status: 401 });
    }

    const { topicId, board, subjectName, quantidade } = await req.json();

    if (!board || !subjectName) {
      return NextResponse.json({ erro: "Banca e disciplina são obrigatórios." }, { status: 400 });
    }

    // Chama o Agente Criador de Questões
    const gerado = await gerarNovasQuestoes(board, subjectName, quantidade || 3);

    if (!gerado.questoes || gerado.questoes.length === 0) {
      return NextResponse.json({ erro: "A IA não conseguiu gerar as questões." }, { status: 500 });
    }

    // Prepara os dados para inserir no banco
    const questoesParaSalvar = gerado.questoes.map((q: any) => ({
      text: q.text,
      options: q.options,
      correctOption: q.correctOption,
      explanation: q.explanation,
      type: q.type,
      board: board,
      year: new Date().getFullYear(),
      topicId: topicId || null // Se não passar topicId, fica genérica no banco
    }));

    // Salva no Neon
    await prisma.question.createMany({
      data: questoesParaSalvar
    });

    return NextResponse.json({ sucesso: true, quantidade: questoesParaSalvar.length });
  } catch (error) {
    console.error("Erro na rota de geração de questões:", error);
    return NextResponse.json({ erro: "Falha ao processar a geração de questões." }, { status: 500 });
  }
}
