import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ 
  connectionString,
  ssl: { rejectUnauthorized: false }
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("Limpando banco de dados...")
  
  // Limpeza na ordem correta devido às chaves estrangeiras
  await prisma.userAnswer.deleteMany()
  await prisma.errorNotebookItem.deleteMany()
  await prisma.question.deleteMany()
  await prisma.studySession.deleteMany()
  await prisma.skill.deleteMany()
  await prisma.topic.deleteMany()
  await prisma.subject.deleteMany()
  await prisma.examDocument.deleteMany()
  await prisma.studyPlan.deleteMany()
  await prisma.exam.deleteMany()
  await prisma.material.deleteMany()
  await prisma.user.deleteMany()

  console.log("Banco limpo. Criando usuário de teste...")

  const passwordHash = await bcrypt.hash("123456", 10)
  const user = await prisma.user.create({
    data: {
      name: "Estudante Flow",
      email: "estudante@concursoflow.com",
      password: passwordHash,
      role: "STUDENT",
    }
  })

  console.log("Criando Edital da Polícia Federal...")

  // Criação de Concurso (Polícia Federal) com disciplinas e tópicos
  const exam = await prisma.exam.create({
    data: {
      userId: user.id,
      title: "Polícia Federal 2024 - Agente",
      agency: "Departamento de Polícia Federal",
      board: "CEBRASPE",
      status: "OPEN",
      subjects: {
        create: [
          {
            name: "Língua Portuguesa",
            weight: 1.5,
            topics: {
              create: [
                { name: "Compreensão e interpretação de textos" },
                { name: "Sintaxe da oração e do período" },
                { name: "Emprego do sinal indicativo de crase" }
              ]
            }
          },
          {
            name: "Direito Constitucional",
            weight: 1.0,
            topics: {
              create: [
                { name: "Direitos e Garantias Fundamentais" },
                { name: "Organização do Estado" },
                { name: "Defesa do Estado e das Instituições" }
              ]
            }
          },
          {
            name: "Direito Administrativo",
            weight: 1.0,
            topics: {
              create: [
                { name: "Atos Administrativos" },
                { name: "Poderes da Administração" },
                { name: "Responsabilidade Civil do Estado" }
              ]
            }
          }
        ]
      }
    }
  })

  console.log("Injetando Acervo Real de Questões...")

  // Questões Reais
  await prisma.question.createMany({
    data: [
      // CEBRASPE - Português
      {
        text: "No que se refere à correção gramatical e à coerência do texto, julgue o item: A substituição de 'têm acesso' por 'tem acesso' não prejudicaria a correção do período, dado o sentido genérico da expressão.",
        options: ["Certo", "Errado"],
        correctOption: 1, // Errado
        explanation: "Errado. O verbo 'ter' recebe acento circunflexo (têm) na terceira pessoa do plural para concordar com um sujeito no plural. Mudar para 'tem' quebraria a concordância gramatical.",
        board: "CEBRASPE",
        year: 2021,
        type: "CERTO_ERRADO"
      },
      {
        text: "Acerca da organização de ideias no texto, julgue: O uso da vírgula logo após 'Entretanto' é facultativo, por se tratar de conjunção adversativa deslocada.",
        options: ["Certo", "Errado"],
        correctOption: 1, // Errado
        explanation: "Errado. Quando a conjunção 'Entretanto' inicia a oração, a vírgula é recomendada mas não obrigatória; porém, se estiver deslocada no meio da frase, o uso de vírgulas (entre vírgulas) é estritamente obrigatório.",
        board: "CEBRASPE",
        year: 2023,
        type: "CERTO_ERRADO"
      },
      // CEBRASPE - Constitucional
      {
        text: "Conforme a Constituição Federal, é livre a manifestação do pensamento, sendo garantido o anonimato nas redes sociais.",
        options: ["Certo", "Errado"],
        correctOption: 1, // Errado
        explanation: "Errado. O art. 5º, inciso IV da CF determina: 'é livre a manifestação do pensamento, SENDO VEDADO o anonimato'. O examinador inverteu a regra.",
        board: "CEBRASPE",
        year: 2022,
        type: "CERTO_ERRADO"
      },
      {
        text: "É inviolável o sigilo da correspondência e das comunicações telegráficas, de dados e das comunicações telefônicas, salvo, no último caso, por ordem judicial, para fins de investigação criminal.",
        options: ["Certo", "Errado"],
        correctOption: 0, // Certo
        explanation: "Certo. Trata-se da literalidade do inciso XII do art. 5º da CF. O sigilo telefônico só pode ser quebrado por ordem judicial e para fins penais.",
        board: "CEBRASPE",
        year: 2021,
        type: "CERTO_ERRADO"
      },
      // FGV - Administrativo
      {
        text: "João, servidor público, praticou ato com vício de competência (não exclusiva). A autoridade superior tomou ciência. O que deve acontecer com este ato?",
        options: [
          "A anulação é obrigatória e imediata.",
          "O ato é nulo de pleno direito, não admitindo convalidação.",
          "O ato pode ser convalidado pela autoridade superior competente, desde que não haja lesão ao interesse público.",
          "O ato deve ser revogado por motivos de conveniência."
        ],
        correctOption: 2,
        explanation: "O vício de competência (quando não exclusiva) caracteriza nulidade relativa, sendo passível de convalidação (art. 55 da Lei 9.784/99) caso não lese terceiros.",
        board: "FGV",
        year: 2023,
        type: "MULTIPLA_ESCOLHA"
      },
      {
        text: "Em matéria de responsabilidade civil do Estado, no Brasil adota-se predominantemente a teoria do risco administrativo. Isso significa que:",
        options: [
          "O Estado responde sempre, mesmo por culpa exclusiva da vítima.",
          "Exige-se a comprovação de culpa ou dolo do agente estatal.",
          "Basta o nexo causal entre a ação estatal e o dano, admitindo-se excludentes de responsabilidade.",
          "O Estado só responde se houver previsão legal expressa."
        ],
        correctOption: 2,
        explanation: "A Teoria do Risco Administrativo (art. 37, §6º da CF) dispensa a culpa (responsabilidade objetiva), mas admite excludentes como culpa exclusiva da vítima ou caso fortuito.",
        board: "FGV",
        year: 2022,
        type: "MULTIPLA_ESCOLHA"
      },
      // FCC - Constitucional
      {
        text: "A respeito dos direitos políticos, o estrangeiro e o conscrito (durante o serviço militar obrigatório):",
        options: [
          "São alistáveis, mas inelegíveis.",
          "O estrangeiro é inalistável; o conscrito é alistável.",
          "São inalistáveis e, portanto, inelegíveis.",
          "Podem votar apenas em plebiscitos locais."
        ],
        correctOption: 2,
        explanation: "Art. 14, § 2º da CF: 'Não podem alistar-se como eleitores os estrangeiros e, durante o período do serviço militar obrigatório, os conscritos'. Sem alistamento, não há elegibilidade.",
        board: "FCC",
        year: 2023,
        type: "MULTIPLA_ESCOLHA"
      },
      // Inédita / Outras (Raciocínio Lógico CEBRASPE)
      {
        text: "Julgue o item: Na proposição P: 'Se chove, então a rua fica molhada', a recíproca 'Se a rua fica molhada, então chove' possui exatamente o mesmo valor lógico da proposição original.",
        options: ["Certo", "Errado"],
        correctOption: 1, // Errado
        explanation: "Errado. Em lógica proposicional, a condicional (P -> Q) não equivale à sua recíproca (Q -> P). A rua pode estar molhada por outro motivo (ex: alguém lavou).",
        board: "CEBRASPE",
        year: 2020,
        type: "CERTO_ERRADO"
      },
      {
        text: "A negação da proposição 'Todos os políticos são honestos' é 'Nenhum político é honesto'.",
        options: ["Certo", "Errado"],
        correctOption: 1, // Errado
        explanation: "Errado. A negação de 'Todos são X' é 'Pelo menos um NÃO é X' (Algum político não é honesto). Dizer que 'nenhum' é honesto é o contrário, não a negação lógica.",
        board: "CEBRASPE",
        year: 2021,
        type: "CERTO_ERRADO"
      }
    ]
  })

  console.log("Banco Populado com sucesso com 9 Questões Estratégicas Reais!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
