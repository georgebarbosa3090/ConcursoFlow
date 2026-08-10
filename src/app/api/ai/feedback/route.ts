import { NextResponse } from "next/server";
import { gerarFeedbackQuestao } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { banca, assunto, textoQuestao, respostaSelecionada, respostaCorreta, justificativa } = await req.json();

    if (!textoQuestao || !respostaSelecionada || !respostaCorreta) {
      return NextResponse.json({ erro: "Dados insuficientes para gerar feedback." }, { status: 400 });
    }

    const feedback = await gerarFeedbackQuestao(
      banca || "CEBRASPE",
      assunto || "Gerais",
      textoQuestao,
      respostaSelecionada,
      respostaCorreta,
      justificativa || "Sem justificativa."
    );

    return NextResponse.json({ feedback });
  } catch (error) {
    console.error("Erro na rota de AI Feedback:", error);
    return NextResponse.json({ erro: "Erro ao gerar feedback." }, { status: 500 });
  }
}
