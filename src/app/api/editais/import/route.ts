import { NextResponse } from "next/server";

// Mapeamento das dicas estratégicas por banca
const BANCA_TIPS: Record<string, { disciplinas: string[]; dica: string }> = {
  Cebraspe: {
    disciplinas: ["Língua Portuguesa", "Raciocínio Lógico", "Direito Constitucional", "Informática", "Segurança da Informação"],
    dica: "Foco em questões Certo/Errado com atenção às palavras-âncora (sempre, nunca, apenas). Português exige interpretação cirúrgica."
  },
  FGV: {
    disciplinas: ["Língua Portuguesa", "Raciocínio Analítico", "Direito Administrativo", "Bancos de Dados", "Programação Orientada a Objetos"],
    dica: "Estude os fundamentos conceituais com profundidade. A FGV valoriza compreensão, não decoreba de lei."
  },
  FCC: {
    disciplinas: ["Língua Portuguesa (Gramática)", "Raciocínio Lógico", "Legislação Trabalhista", "Informática Básica", "Direito Processual"],
    dica: "Lei seca e gramática normativa são a base. Leia o texto da lei com atenção — a FCC cobra a redação literal."
  },
  VUNESP: {
    disciplinas: ["Língua Portuguesa", "Matemática", "Direito Constitucional", "Informática Básica", "Legislação Estadual"],
    dica: "Provas bem estruturadas e claras. Resolva provas anteriores — o estilo é muito consistente entre editais."
  },
  Quadrix: {
    disciplinas: ["Ética Profissional", "Legislação do Conselho", "Raciocínio Lógico", "Informática", "Língua Portuguesa"],
    dica: "Atenção ao regulamento do conselho profissional específico. Questões de Certo/Errado com palavras absolutas como armadilhas."
  }
};

export async function POST(req: Request) {
  try {
    const { url, title, board } = await req.json();

    if (!title) {
      return NextResponse.json({ erro: "Título do concurso é obrigatório." }, { status: 400 });
    }

    // Simula delay de processamento do Agente IA (1.5s)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const bancaTips = BANCA_TIPS[board as string] ?? {
      disciplinas: ["Língua Portuguesa", "Raciocínio Lógico", "Conhecimentos Específicos", "Informática", "Legislação Pertinente"],
      dica: "Consulte o edital oficial para verificar as disciplinas e seus pesos específicos."
    };

    const extraido = {
      concurso: title,
      banca: board || "Banca a Identificar",
      cargo: "Cargo Identificado no Edital",
      vagas: 100,
      dataProva: "A definir — aguardar publicação",
      urlOrigem: url,
      estrategiaBanca: bancaTips.dica,
      disciplinas: bancaTips.disciplinas.map((nome, idx) => ({
        nome,
        peso: idx === 0 ? 1.5 : 1.0,
        topicos: gerarTopicos(nome)
      }))
    };

    return NextResponse.json({ sucesso: true, dados: extraido });
  } catch {
    return NextResponse.json({ erro: "Falha ao processar o edital." }, { status: 500 });
  }
}

function gerarTopicos(disciplina: string): string[] {
  const topicosMap: Record<string, string[]> = {
    "Língua Portuguesa": ["Compreensão e interpretação de textos", "Ortografia oficial", "Sintaxe da oração", "Concordância verbal e nominal", "Regência verbal e nominal"],
    "Língua Portuguesa (Gramática)": ["Morfologia", "Concordância", "Regência", "Crase", "Pontuação"],
    "Raciocínio Lógico": ["Lógica proposicional", "Tabelas-verdade", "Diagramas lógicos", "Probabilidade", "Análise combinatória"],
    "Raciocínio Analítico": ["Argumentação lógica", "Sequências e séries", "Interpretação de gráficos", "Raciocínio dedutivo"],
    "Matemática": ["Aritmética básica", "Porcentagem e juros", "Equações e funções", "Geometria plana", "Estatística descritiva"],
    "Informática": ["Redes de computadores", "Segurança da informação", "Pacote Office", "Sistemas Operacionais", "Internet e navegadores"],
    "Informática Básica": ["Windows e Linux", "Word e Excel", "Internet", "E-mail e navegação segura"],
    "Segurança da Informação": ["Criptografia", "Ameaças (vírus, ransomware)", "Controle de acesso", "LGPD", "Firewall e VPN"],
    "Direito Constitucional": ["Princípios fundamentais", "Direitos e garantias fundamentais", "Organização do Estado", "Poder Judiciário", "Controle de constitucionalidade"],
    "Direito Administrativo": ["Atos administrativos", "Poderes da Administração", "Licitações (Lei 14.133/21)", "Servidores públicos", "Improbidade administrativa"],
    "Ética Profissional": ["Princípios éticos", "Código de ética do conselho", "Sigilo profissional", "Relações com pacientes/clientes"],
  };
  return topicosMap[disciplina] ?? ["Fundamentos da disciplina", "Legislação correlata", "Questões aplicadas"];
}
