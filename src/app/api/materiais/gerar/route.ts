import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { gerarApostilaComIA } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { examTitle, board, subjectName, topicName } = await req.json();

    if (!examTitle || !subjectName || !topicName) {
      return NextResponse.json({ error: "Parâmetros insuficientes" }, { status: 400 });
    }

    // Chama a IA para gerar o Markdown
    const markdownContent = await gerarApostilaComIA(examTitle, board || "Indefinida", subjectName, topicName);

    // Salva o material no banco de dados
    const material = await prisma.material.create({
      data: {
        userId: session.user.id,
        title: `Apostila: ${topicName}`,
        content: markdownContent,
        type: "PDF", // Usaremos PDF/Apostila genericamente
      }
    });

    return NextResponse.json({ success: true, materialId: material.id });
  } catch (error: any) {
    console.error("Erro no endpoint gerar apostila:", error);
    return NextResponse.json({ error: "Falha interna do servidor" }, { status: 500 });
  }
}
