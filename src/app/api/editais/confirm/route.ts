import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ erro: "Não autenticado." }, { status: 401 });
    }

    const { concurso, banca, disciplinas } = await req.json();

    if (!concurso) {
      return NextResponse.json({ erro: "Dados inválidos." }, { status: 400 });
    }

    // Busca o usuário logado
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ erro: "Usuário não encontrado." }, { status: 404 });
    }

    // Prepara os dados aninhados para criar o Exam com Subjects e Topics
    const examData = {
      title: concurso,
      board: banca,
      status: "OPEN",
      userId: user.id,
      subjects: {
        create: disciplinas.map((disc: any) => ({
          name: disc.nome,
          weight: disc.peso || 1,
          topics: {
            create: disc.topicos.map((topicoNome: string) => ({
              name: topicoNome
            }))
          }
        }))
      }
    };

    const exam = await prisma.exam.create({
      data: examData
    });

    return NextResponse.json({ sucesso: true, examId: exam.id });
  } catch (error) {
    console.error("Erro ao salvar edital no banco:", error);
    return NextResponse.json({ erro: "Falha interna no servidor." }, { status: 500 });
  }
}
