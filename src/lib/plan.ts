import prisma from "./prisma";

export async function getOrGeneratePlan(userId: string, examId: string) {
  // Busca o plano existente
  let plan = await prisma.studyPlan.findFirst({
    where: { userId, examId },
    include: {
      sessions: {
        orderBy: { date: 'asc' }
      }
    }
  });

  // Se já existe e tem sessões, retorna
  if (plan && plan.sessions.length > 0) {
    return plan;
  }

  // Senão, cria o plano
  if (!plan) {
    plan = await prisma.studyPlan.create({
      data: {
        userId,
        examId
      },
      include: {
        sessions: true
      }
    });
  }

  // Busca o edital completo para extrair tópicos
  const exam = await prisma.exam.findUnique({
    where: { id: examId },
    include: {
      subjects: {
        include: { topics: true }
      }
    }
  });

  if (!exam || exam.subjects.length === 0) return plan;

  // Algoritmo Genético de Distribuição (Versão Simplificada)
  // Distribui os tópicos ao longo de 7 dias
  const sessoesParaCriar = [];
  let dataAtual = new Date();
  dataAtual.setHours(8, 0, 0, 0); // Começa às 8h da manhã

  // Coleta todos os tópicos
  const todosTopicos: { subName: string, topName: string }[] = [];
  exam.subjects.forEach(sub => {
    if (sub.topics.length === 0) {
      todosTopicos.push({ subName: sub.name, topName: "Revisão Geral" });
    } else {
      sub.topics.forEach(top => {
        todosTopicos.push({ subName: sub.name, topName: top.name });
      });
    }
  });

  // Mistura os tópicos (shuffle)
  todosTopicos.sort(() => Math.random() - 0.5);

  // Cria 3 sessões por dia, para os próximos 7 dias (ou até acabar os tópicos)
  let topicoIndex = 0;
  for (let dia = 0; dia < 7; dia++) {
    const dataSessao = new Date(dataAtual);
    dataSessao.setDate(dataSessao.getDate() + dia);

    for (let s = 0; s < 3; s++) {
      if (topicoIndex >= todosTopicos.length) {
        // Se acabaram os tópicos, volta do início para revisão
        topicoIndex = 0;
      }
      
      const item = todosTopicos[topicoIndex];
      const tipo = s === 0 ? 'Teoria' : (s === 1 ? 'Questões' : 'Revisão');
      const duracao = s === 0 ? 60 : (s === 1 ? 45 : 30);
      
      sessoesParaCriar.push({
        planId: plan.id,
        date: dataSessao,
        duration: duracao,
        type: `${tipo} - ${item.subName}: ${item.topName}`,
        status: "PENDING"
      });

      topicoIndex++;
    }
  }

  // Salva as sessões
  await prisma.studySession.createMany({
    data: sessoesParaCriar
  });

  // Busca o plano recém atualizado
  return await prisma.studyPlan.findFirst({
    where: { id: plan.id },
    include: {
      sessions: {
        orderBy: { date: 'asc' }
      }
    }
  });
}
