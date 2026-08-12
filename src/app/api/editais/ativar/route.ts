import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { examId } = body;

    if (!examId) {
      return NextResponse.json({ error: "Faltam parâmetros" }, { status: 400 });
    }

    // Apenas dá um "touch" na data de atualização para torná-lo o concurso mais recente
    const exam = await prisma.exam.update({
      where: {
        id: examId,
        userId: session.user.id
      },
      data: {
        updatedAt: new Date()
      }
    });

    return NextResponse.json({ success: true, exam });
  } catch (error: any) {
    console.error("Erro ao ativar concurso:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
