import { NextResponse } from "next/server";
import { extrairEditalComIA } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { url, title, board } = await req.json();

    if (!title) {
      return NextResponse.json({ erro: "Título do concurso é obrigatório." }, { status: 400 });
    }

    // Chama o Agente Extrator com GPT-4o-mini
    const extraido = await extrairEditalComIA(title, board || "Banca não informada", url || "");

    return NextResponse.json({ sucesso: true, dados: extraido });
  } catch (error) {
    console.error("Erro na rota de extração:", error);
    return NextResponse.json({ erro: "Falha ao processar o edital." }, { status: 500 });
  }
}
