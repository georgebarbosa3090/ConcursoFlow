"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { useState, useRef, useEffect } from "react";
import { Bot, Send, User, Sparkles, AlertCircle, Scale, BookCheck } from "lucide-react";

type BancaId = "cebraspe" | "fgv" | "fcc" | "vunesp" | "quadrix";

interface Banca {
  id: BancaId;
  nome: string;
  cor: string;
  badge: string;
}

interface Message {
  role: "user" | "agent";
  content: string;
  timestamp: Date;
}

const bancas: Banca[] = [
  { id: "cebraspe", nome: "Cebraspe / CESPE", cor: "bg-blue-600", badge: "bg-blue-100 text-blue-800" },
  { id: "fgv",      nome: "FGV",              cor: "bg-purple-600", badge: "bg-purple-100 text-purple-800" },
  { id: "fcc",      nome: "FCC",              cor: "bg-emerald-600", badge: "bg-emerald-100 text-emerald-800" },
  { id: "vunesp",   nome: "VUNESP",           cor: "bg-orange-600", badge: "bg-orange-100 text-orange-800" },
  { id: "quadrix",  nome: "Quadrix",          cor: "bg-rose-600",   badge: "bg-rose-100 text-rose-800" },
];

// Base de conhecimento do agente sobre as bancas
const BANCA_KNOWLEDGE: Record<BancaId, Record<string, string>> = {
  cebraspe: {
    estilo: "Certo/Errado (C/E) é o formato mais comum. Uma questão ERRADA desconta pontos — não deixe sem responder apenas se estiver muito inseguro.",
    portugues: "Cobra muito interpretação de texto. A prova é armada: uma afirmação quase correta pode conter um erro sutil de concordância ou de sentido. Leia o enunciado com extrema atenção.",
    raciocinio: "Lógica proposicional, tabelas-verdade e diagramas são frequentes. O Cebraspe gosta de afirmações negativas dentro de silogismos.",
    informatica: "Cobra segurança da informação (criptografia, ameaças), redes (TCP/IP, camadas OSI), e pacote Office. Questões de código Python aparecem em TI.",
    dica_geral: "Não existe 'pegadinha gratuita'. O erro sempre está no enunciado — uma troca de conjunção (e/ou), uma negação extra, ou um número errado. Treine ler devagar.",
    historico: "Responsável pelas provas de PF, PRF, ANAC, STJ, TCU, entre outros. Bancas de alto prestígio com questões difíceis."
  },
  fgv: {
    estilo: "Questões de múltipla escolha (5 alternativas). Cobra raciocínio conceitual profundo — menos decoreba, mais entendimento dos fundamentos.",
    portugues: "Foco em gramática objetiva (sintaxe, morfologia). Textos literários de alta complexidade são comuns em nível superior.",
    raciocinio: "Raciocínio analítico, séries e sequências com lógica matemática avançada. FGV investe em questões de interpretação de dados complexas.",
    informatica: "Bancos de dados (SQL, modelagem), programação orientada a objeto e análise de sistemas são frequentes em cargos de TI.",
    dica_geral: "Estude os fundamentos teóricos com profundidade. A FGV valoriza quem entende o conceito, não quem apenas memorizou uma frase de lei.",
    historico: "Bancas de OAB, TJ-RJ, SEFAZ-RJ, ALESP. Muito presente em concursos estaduais do Rio de Janeiro e São Paulo."
  },
  fcc: {
    estilo: "Múltipla escolha com 5 alternativas. Histórica por cobrar letra de lei de forma quase literal — é a 'banca da lei seca'.",
    portugues: "Gramática normativa intensiva: concordância, regência, emprego de crase, pontuação (vírgula). Literalidade da norma culta.",
    raciocinio: "Questões de lógica mais tradicionais. Menos lógica formal, mais raciocínio matemático aplicado (juros, porcentagem, equações).",
    informatica: "Internet (protocolos, segurança), Windows/Linux, redes básicas. Em comparação com Cebraspe, é menos aprofundada em TI.",
    dica_geral: "Leia o texto da lei com atenção. A FCC raramente inova na cobrança: ela pega a lei, troca uma palavra e faz a alternativa errada. Conheça a lei no detalhe.",
    historico: "Bancas do TRT, TRE, METRO-SP, ARTESP, AL-SP. Forte nos concursos da Justiça do Trabalho em todo o Brasil."
  },
  vunesp: {
    estilo: "Múltipla escolha com 5 alternativas. Prova bem estruturada e com enunciados claros. Frequentemente vista como mais 'justa' que Cebraspe.",
    portugues: "Prioriza compreensão e interpretação textual com questões longas e textos jornalísticos ou literários de alta qualidade.",
    raciocinio: "Lógica clássica e matemática. Questões bem redigidas, sem ambiguidade. Frequente cobrança de probabilidade e análise combinatória.",
    informatica: "Office (Excel, Word), internet e segurança básica. Questões práticas sobre uso de sistemas e ferramentas computacionais.",
    dica_geral: "Treine com provas anteriores da VUNESP. O estilo é consistente entre as provas — quem domina os gabaritos passados tem vantagem enorme.",
    historico: "TJ-SP (maior concurso estadual do país), PC-SP, SAAE, Municípios do interior de São Paulo. Extremamente presente no estado."
  },
  quadrix: {
    estilo: "Certo/Errado e múltipla escolha. Cobra conteúdo de forma direta, mas com algumas armadilhas de redação de enunciado.",
    portugues: "Interpretação textual direta. Gramática com foco em morfologia e sintaxe básica. Menos exigente que Cebraspe em português.",
    raciocinio: "Matemática e raciocínio lógico de nível intermediário. Questões de aritmética, porcentagem e probabilidade são comuns.",
    informatica: "Segurança da informação, internet, redes e pacote Office. Cobranças similares ao estilo Cebraspe, mas com menor profundidade.",
    dica_geral: "A Quadrix vem assumindo grandes concursos federais. Treine o formato Certo/Errado sem perder o foco nas palavras absolutas (sempre, nunca, apenas) que costumam ser armadilhas.",
    historico: "CFF, CFO, CFN, CFM, CFE (Conselhos Federais de profissões). Crescendo em órgãos federais e autarquias."
  }
};

function agentRespond(bancaId: BancaId | null, userMessage: string): string {
  const lower = userMessage.toLowerCase();

  if (!bancaId) {
    return "Por favor, selecione uma banca no painel à esquerda para eu poder te dar dicas precisas e personalizadas!";
  }

  const knowledge = BANCA_KNOWLEDGE[bancaId];
  const bancaNome = bancas.find(b => b.id === bancaId)?.nome ?? bancaId;

  if (lower.includes("estilo") || lower.includes("formato") || lower.includes("prova")) {
    return `📋 **Estilo de prova — ${bancaNome}:**\n\n${knowledge.estilo}`;
  }
  if (lower.includes("português") || lower.includes("lingua") || lower.includes("gramatica") || lower.includes("gramática")) {
    return `📝 **Língua Portuguesa na ${bancaNome}:**\n\n${knowledge.portugues}`;
  }
  if (lower.includes("lógica") || lower.includes("logica") || lower.includes("raciocínio") || lower.includes("raciocinio") || lower.includes("matemática") || lower.includes("matematica")) {
    return `🔢 **Raciocínio Lógico / Matemático na ${bancaNome}:**\n\n${knowledge.raciocinio}`;
  }
  if (lower.includes("informática") || lower.includes("informatica") || lower.includes("computador") || lower.includes("tecnologia") || lower.includes("ti")) {
    return `💻 **Informática na ${bancaNome}:**\n\n${knowledge.informatica}`;
  }
  if (lower.includes("dica") || lower.includes("estratégia") || lower.includes("estrategia") || lower.includes("como estudar") || lower.includes("conselho")) {
    return `💡 **Estratégia geral para a ${bancaNome}:**\n\n${knowledge.dica_geral}`;
  }
  if (lower.includes("histórico") || lower.includes("historico") || lower.includes("concursos") || lower.includes("órgãos") || lower.includes("orgaos")) {
    return `🏛️ **Histórico da ${bancaNome}:**\n\n${knowledge.historico}`;
  }

  // Resposta genérica com sumário
  return `Olá! Sou especialista em **${bancaNome}**. Posso te ajudar com:\n\n` +
    `• 📋 **Estilo de prova** — formato das questões e regras de pontuação\n` +
    `• 📝 **Língua Portuguesa** — o que essa banca mais cobra\n` +
    `• 🔢 **Raciocínio Lógico** — tipo de questões e nível de dificuldade\n` +
    `• 💻 **Informática** — assuntos prioritários\n` +
    `• 💡 **Estratégia** — como estudar especificamente para essa banca\n` +
    `• 🏛️ **Histórico** — quais concursos essa banca organiza\n\n` +
    `O que você quer saber?`;
}

export default function AgenteBancasPage() {
  const [selectedBanca, setSelectedBanca] = useState<BancaId | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "agent",
      content: "Olá! Sou o **Agente Especialista em Bancas** do ConcursoFlow AI 🤖\n\nSelecione uma banca no painel à esquerda e me faça qualquer pergunta: estilo de prova, matérias mais cobradas, estratégias de estudo…\n\nEstou aqui para te dar as dicas exatas que a banca exige!",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleBancaSelect = (bancaId: BancaId) => {
    setSelectedBanca(bancaId);
    const bancaNome = bancas.find(b => b.id === bancaId)?.nome;
    const welcomeMsg: Message = {
      role: "agent",
      content: `Ótimo! Agora sou seu especialista na **${bancaNome}**. O que você quer saber sobre essa banca? Pode perguntar sobre estilo de prova, português, lógica, informática ou estratégia!`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, welcomeMsg]);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: "user", content: input.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simula latência da IA
    await new Promise(r => setTimeout(r, 800 + Math.random() * 600));

    const response = agentRespond(selectedBanca, userMsg.content);
    const agentMsg: Message = { role: "agent", content: response, timestamp: new Date() };
    setIsTyping(false);
    setMessages(prev => [...prev, agentMsg]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Renderiza markdown simples (negrito e quebras de linha)
  const renderMessage = (text: string) => {
    return text.split("\n").map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <p key={i} className="mb-1 last:mb-0">
          {parts.map((part, j) =>
            j % 2 === 1 ? <strong key={j}>{part}</strong> : part
          )}
        </p>
      );
    });
  };

  return (
    <MainLayout>
      <div className="flex h-[calc(100vh-0px)] overflow-hidden">
        {/* Sidebar de bancas */}
        <div className="hidden lg:flex flex-col w-64 border-r border-slate-200 bg-white shrink-0">
          <div className="p-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Sparkles size={18} className="text-blue-600" />
              Bancas Disponíveis
            </h3>
            <p className="text-xs text-slate-500 mt-1">Selecione para receber dicas específicas</p>
          </div>
          <div className="flex-1 p-3 space-y-2 overflow-y-auto">
            {bancas.map(banca => (
              <button
                key={banca.id}
                onClick={() => handleBancaSelect(banca.id)}
                className={`w-full text-left px-4 py-3 rounded-xl font-medium text-sm transition-all border ${
                  selectedBanca === banca.id
                    ? `${banca.cor} text-white border-transparent shadow-md`
                    : "border-slate-200 text-slate-700 hover:border-blue-200 hover:bg-slate-50"
                }`}
              >
                {banca.nome}
                {selectedBanca === banca.id && <span className="block text-xs opacity-80 mt-0.5">✓ Selecionada</span>}
              </button>
            ))}
          </div>

          {/* Quick tips */}
          <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Perguntas Sugeridas</p>
            {["Como é o estilo de prova?", "Dicas para Português", "Estratégia de estudo", "Quais concursos organiza?"].map(q => (
              <button
                key={q}
                onClick={() => { setInput(q); }}
                className="w-full text-left text-xs text-blue-600 hover:text-blue-800 px-2 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow">
                <Bot size={20} className="text-white" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">Agente Especialista em Bancas</h2>
                <p className="text-xs text-slate-500">
                  {selectedBanca
                    ? `Modo: ${bancas.find(b => b.id === selectedBanca)?.nome}`
                    : "Selecione uma banca para começar"}
                </p>
              </div>
            </div>
            {selectedBanca && (
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${bancas.find(b => b.id === selectedBanca)?.badge}`}>
                {bancas.find(b => b.id === selectedBanca)?.nome}
              </span>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-4 bg-slate-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  msg.role === "agent"
                    ? "bg-gradient-to-br from-blue-500 to-indigo-600"
                    : "bg-slate-700"
                }`}>
                  {msg.role === "agent"
                    ? <Bot size={16} className="text-white" />
                    : <User size={16} className="text-white" />
                  }
                </div>
                <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                  msg.role === "agent"
                    ? "bg-white text-slate-800 border border-slate-100 rounded-tl-none"
                    : "bg-blue-600 text-white rounded-tr-none"
                }`}>
                  {renderMessage(msg.content)}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <Bot size={16} className="text-white" />
                </div>
                <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                  <div className="flex gap-1 items-center h-5">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-4 md:px-6 py-4 bg-white border-t border-slate-200 shrink-0">
            <div className="flex gap-3 items-center">
              <input
                id="chat-input"
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={selectedBanca ? "Pergunte sobre a banca selecionada…" : "Selecione uma banca primeiro…"}
                className="flex-1 px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
              />
              <button
                id="chat-send"
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition disabled:opacity-50 shadow-sm"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
