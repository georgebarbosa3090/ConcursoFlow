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
    throw new Error("Falha na geração do edital com IA.");
  }
}
