import OpenAI from 'openai';

// Instância da OpenAI (exigirá OPENAI_API_KEY no .env)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key',
});

type Banca = 'CEBRASPE' | 'FGV' | 'FCC' | 'VUNESP' | string;

export async function gerarFeedbackQuestao(
  banca: Banca,
  assunto: string,
  textoQuestao: string,
  respostaSelecionada: string,
  respostaCorreta: string,
  justificativa: string
) {
  // Configura a personalidade do agente especialista baseado na banca
  let systemPrompt = "Você é um professor especialista em concursos públicos.";
  
  if (banca === 'CEBRASPE') {
    systemPrompt = "Você é um professor carrasco especialista no CEBRASPE (CESPE). Você enfatiza que uma questão errada anula uma certa, adora encontrar pegadinhas semânticas (palavras como 'sempre', 'nunca', 'prescinde') e dá explicações diretas e cirúrgicas sobre o porquê o item está Certo ou Errado.";
  } else if (banca === 'FGV') {
    systemPrompt = "Você é um professor especialista na FGV. Você gosta de explicar textos longos e casos hipotéticos complexos. Você explica por que a alternativa correta é a mais completa, e por que as outras, mesmo parecendo certas, estão incorretas com base na jurisprudência atualizada ou na interpretação textual fina.";
  } else if (banca === 'FCC') {
    systemPrompt = "Você é um professor especialista na FCC (Fundação Copia e Cola). Você foca na literalidade da lei. Suas explicações costumam citar o artigo exato da lei seca ou a regra gramatical exata, sem muitas voltas.";
  }

  const userPrompt = `
  Assunto: ${assunto}
  Questão: ${textoQuestao}
  
  Resposta que o aluno marcou: ${respostaSelecionada}
  Resposta Correta: ${respostaCorreta}
  Justificativa Base: ${justificativa}
  
  O aluno errou ou teve dúvida. Dê um feedback curto (máximo de 3 parágrafos) encarnando a sua personalidade de especialista na banca ${banca}, explicando o erro e dando uma dica de ouro para ele não cair mais nessa pegadinha.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // modelo rápido e barato
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 350,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Erro ao chamar OpenAI:", error);
    return "Não foi possível gerar o feedback da IA no momento. Estude a justificativa padrão!";
  }
}

export async function extrairEditalComIA(titulo: string, banca: string, url: string) {
  const systemPrompt = `Você é um Agente Especialista em Editais de Concursos Públicos Brasileiros.
Sua missão é deduzir e gerar a estrutura de um edital com base no título do concurso e na banca informada.
Você deve responder ESTRITAMENTE em formato JSON, sem marcação markdown (sem \`\`\`json), com a seguinte estrutura exata:
{
  "concurso": "Nome do Concurso",
  "banca": "Nome da Banca",
  "cargo": "Nome do Cargo Deduzido",
  "dataProva": "A definir",
  "urlOrigem": "URL fornecida",
  "estrategiaBanca": "Dica estratégica de 1 parágrafo sobre como esta banca cobra as questões.",
  "disciplinas": [
    {
      "nome": "Nome da Disciplina",
      "peso": 1.5,
      "topicos": ["Tópico 1", "Tópico 2", "Tópico 3"]
    }
  ]
}
Gere disciplinas realistas (Português, Raciocínio Lógico, Informática, Direitos) e tópicos típicos exigidos por essa banca para o cargo provável. Use pesos de 1 a 2.`;

  const userPrompt = `Por favor, gere a estrutura JSON para o seguinte concurso:
Título: ${titulo}
Banca: ${banca}
URL do Edital: ${url}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.5,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("Sem resposta da OpenAI");

    return JSON.parse(content);
  } catch (error) {
    console.error("Erro na extração de edital via IA:", error);
    throw new Error("Falha ao se comunicar com a IA para extrair o edital. Verifique sua chave de API.");
  }
}

export async function gerarNovasQuestoes(banca: string, disciplina: string, quantidade: number = 3) {
  const systemPrompt = `Você é um Criador de Questões Especialista em Concursos Públicos Brasileiros.
Sua missão é gerar exatamente ${quantidade} questões de nível de concurso para a disciplina informada, emulando perfeitamente o estilo e a dificuldade da banca escolhida.
Responda ESTRITAMENTE em formato JSON, sem marcação markdown, contendo um array de questões com a seguinte estrutura:
{
  "questoes": [
    {
      "text": "Texto do enunciado da questão...",
      "options": ["Alternativa A", "Alternativa B", "Alternativa C", "Alternativa D", "Alternativa E"],
      "correctOption": 1, // índice da resposta correta (0 a 4)
      "explanation": "Explicação completa do porquê a opção está correta e as outras erradas, baseada em lei ou teoria.",
      "type": "MULTIPLA_ESCOLHA" // ou CERTO_ERRADO, nesse caso as options são ["Certo", "Errado"]
    }
  ]
}

Regras:
1. Se a banca for CEBRASPE/CESPE, o type OBRIGATÓRIAMENTE deve ser CERTO_ERRADO, options OBRIGATÓRIAMENTE devem ser ["Certo", "Errado"] e correctOption 0 ou 1.
2. Se a banca for FCC ou FGV, type MULTIPLA_ESCOLHA e 5 alternativas.
3. Use casos hipotéticos para FGV e textos de lei seca para FCC.`;

  const userPrompt = `Gere ${quantidade} questões inéditas ou baseadas em provas reais recentes.
Banca: ${banca}
Disciplina: ${disciplina}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.8, // Mais criatividade para não repetir
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("Sem resposta da OpenAI");

    return JSON.parse(content);
  } catch (error) {
    console.error("Erro ao gerar questões via IA:", error);
    throw new Error("Falha ao gerar questões com a IA. Verifique sua chave de API.");
  }
}

export async function gerarApostilaComIA(concurso: string, banca: string, disciplina: string, topico: string) {
  const isTCEMA_TI = concurso.toUpperCase().includes('TCE') && concurso.toUpperCase().includes('TI');
  
  let systemPrompt = `Você é um Gerador de Apostilas Especialista em Concursos Públicos Brasileiros.
Sua missão é criar um material estruturado em Markdown, profundo, claro e didático sobre o assunto solicitado.
Aplique os seguintes princípios:
- Breve Raio-X de como a banca ${banca} costuma cobrar esse tópico.
- Explicações teóricas precisas, sem enrolação.
- Diferenciação entre regra geral e exceção.
- Casos práticos ou exemplos hipotéticos simulando questões da prova.
- Destaque "Pegadinhas Comuns".
- Estrutura clara usando Markdown (##, ###), tabelas, negritos e citações (>).`;

  if (isTCEMA_TI) {
    systemPrompt += `\nAlém disso, aja como o Especialista do TCE-MA 2026 para Auditor de TI.
Integre conceitos de controle externo, auditoria pública e frameworks de governança de TI. Relacione a teoria do tópico com a prática de auditoria de sistemas.`;
  }

  const userPrompt = `Gere a apostila para o seguinte cenário:
Concurso / Foco: ${concurso}
Banca: ${banca}
Disciplina: ${disciplina}
Tópico/Assunto Específico: ${topico}

Retorne APENAS o Markdown, sem texto antes ou depois. Inicie com um # Título Específico.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2500,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("Sem resposta da OpenAI");

    return content;
  } catch (error) {
    console.error("Erro ao gerar apostila via IA:", error);
    throw new Error("Falha ao gerar material com a IA. Verifique sua chave de API.");
  }
}
