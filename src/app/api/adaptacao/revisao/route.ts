import { NextResponse } from "next/server";

interface TopicInput {
  id: number;
  facilidade: number;  // 0–100
  intervalo: number;   // dias
  resposta: "facil" | "medio" | "dificil" | "falha";
}

// SM-2 simplificado: calcula novo intervalo e facilidade
function calcularSM2(topico: TopicInput): { novoIntervalo: number; novaFacilidade: number } {
  // Mapear resposta para qualidade (0-5)
  const qualidade = { facil: 5, medio: 3, dificil: 2, falha: 0 }[topico.resposta];
  
  // Ajuste de facilidade (EF): entre 1.3 e 2.5
  let ef = topico.facilidade / 40; // normalizar 0-100 → aprox 0-2.5
  ef = Math.max(1.3, ef + 0.1 - (5 - qualidade) * (0.08 + (5 - qualidade) * 0.02));

  let novoIntervalo: number;
  if (qualidade < 3) {
    novoIntervalo = 1; // reiniciar se errou
  } else if (topico.intervalo <= 1) {
    novoIntervalo = 6;
  } else {
    novoIntervalo = Math.round(topico.intervalo * ef);
  }

  return {
    novoIntervalo: Math.min(novoIntervalo, 90), // máximo 90 dias
    novaFacilidade: Math.round(ef * 40),         // normalizar de volta 0-100
  };
}

export async function POST(req: Request) {
  try {
    const { topicos }: { topicos: TopicInput[] } = await req.json();

    if (!topicos || topicos.length === 0) {
      return NextResponse.json({ erro: "Nenhum tópico fornecido." }, { status: 400 });
    }

    const resultados = topicos.map(t => {
      const { novoIntervalo, novaFacilidade } = calcularSM2(t);
      const proximaData = new Date();
      proximaData.setDate(proximaData.getDate() + novoIntervalo);

      return {
        id: t.id,
        novoIntervalo,
        novaFacilidade,
        proximaRevisao: proximaData.toISOString().split("T")[0],
        mensagem: novoIntervalo === 1
          ? "⚠️ Tópico reiniciado — estudar amanhã"
          : `✅ Próxima revisão em ${novoIntervalo} dias`
      };
    });

    return NextResponse.json({ sucesso: true, resultados });
  } catch {
    return NextResponse.json({ erro: "Erro no processamento do motor adaptativo." }, { status: 500 });
  }
}
