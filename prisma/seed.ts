import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Iniciando o Novo Seed Realista...');

  // Limpando dados do usuário demo antigo
  try {
    await prisma.user.delete({ where: { email: 'demo@demo.com' } });
    console.log('Usuário demo removido.');
  } catch (e) {
    console.log('Usuário demo não encontrado, continuando...');
  }

  // 1. Criar Usuário Real (Estudante Padrão)
  const hashedPassword = await bcrypt.hash('123456', 10);
  const user = await prisma.user.upsert({
    where: { email: 'estudante@concursoflow.com' },
    update: { password: hashedPassword },
    create: {
      email: 'estudante@concursoflow.com',
      name: 'Estudante Concurseiro',
      password: hashedPassword,
      role: 'STUDENT',
    },
  });

  // 2. Criar Concursos Reais e Disciplinas
  const examPF = await prisma.exam.create({
    data: {
      title: 'Polícia Federal 2026 - Agente',
      agency: 'Polícia Federal',
      board: 'CEBRASPE',
      status: 'OPEN',
      userId: user.id,
      subjects: {
        create: [
          {
            name: 'Língua Portuguesa',
            weight: 1.0,
            topics: {
              create: [
                { name: 'Compreensão de Textos', skills: { create: [{ name: 'Interpretação' }] } },
                { name: 'Sintaxe', skills: { create: [{ name: 'Concordância Verbal' }] } }
              ]
            }
          }
        ]
      }
    }
  });

  const examRFB = await prisma.exam.create({
    data: {
      title: 'Receita Federal - Auditor',
      agency: 'Receita Federal',
      board: 'FGV',
      status: 'OPEN',
      userId: user.id,
      subjects: {
        create: [
          {
            name: 'Direito Tributário',
            weight: 2.0,
            topics: {
              create: [
                { name: 'Impostos Federais', skills: { create: [{ name: 'IRPF e IRPJ' }] } }
              ]
            }
          }
        ]
      }
    }
  });

  // Pegar os IDs dos tópicos criados para vincular as questões
  const pfSubjects = await prisma.subject.findFirst({ where: { examId: examPF.id }, include: { topics: true } });
  const topicPortugues = pfSubjects?.topics[0].id;

  const rfbSubjects = await prisma.subject.findFirst({ where: { examId: examRFB.id }, include: { topics: true } });
  const topicTributario = rfbSubjects?.topics[0].id;

  // 3. Questões Reais das Bancas
  await prisma.question.createMany({
    data: [
      // CEBRASPE (Certo/Errado)
      {
        text: 'A respeito de segurança da informação, julgue o item a seguir: O protocolo HTTPS garante que os dados trocados entre o navegador e o servidor não poderão ser interceptados ou lidos por terceiros, pois trafegam criptografados.',
        options: ['Certo', 'Errado'],
        correctOption: 0,
        explanation: 'CERTO. O HTTPS utiliza SSL/TLS para encriptação.',
        board: 'CEBRASPE',
        year: 2024,
        type: 'RIGHT_WRONG',
        topicId: topicPortugues // Simplificação para o seed
      },
      {
        text: 'Julgue o item: No Microsoft Word, a opção "Pincel de Formatação" permite copiar a formatação de um trecho de texto e aplicá-la a outro, sendo impossível aplicar a mesma formatação a múltiplos trechos consecutivos sem clicar várias vezes no botão.',
        options: ['Certo', 'Errado'],
        correctOption: 1,
        explanation: 'ERRADO. Um clique duplo no Pincel de Formatação permite aplicá-lo múltiplas vezes.',
        board: 'CEBRASPE',
        year: 2023,
        type: 'RIGHT_WRONG',
        topicId: topicPortugues
      },
      // FGV (Múltipla Escolha Complexa)
      {
        text: 'João, auditor, analisou o recolhimento de um tributo que incide sobre o faturamento. Segundo entendimento recente do STF, o ICMS não compõe a base de cálculo de qual tributo abaixo?',
        options: ['Imposto de Renda (IR)', 'PIS e COFINS', 'IPI', 'ISS', 'CSLL'],
        correctOption: 1,
        explanation: 'Tema 69 de Repercussão Geral do STF: "O ICMS não compõe a base de cálculo para a incidência do PIS e da COFINS".',
        board: 'FGV',
        year: 2023,
        type: 'MULTIPLE_CHOICE',
        topicId: topicTributario
      },
      // FCC (Literalidade de Lei)
      {
        text: 'Segundo a Constituição Federal, o mandato dos Ministros do Tribunal de Contas da União é:',
        options: ['Vitalício, após 3 anos de exercício', 'De 8 anos, permitida recondução', 'Eles têm as mesmas garantias e vitaliciedade dos Ministros do STJ', 'De 4 anos'],
        correctOption: 2,
        explanation: 'Art. 73, § 3º: Os Ministros do TCU terão as mesmas garantias, prerrogativas, impedimentos, vencimentos e vantagens dos Ministros do Superior Tribunal de Justiça, incluindo a vitaliciedade.',
        board: 'FCC',
        year: 2022,
        type: 'MULTIPLE_CHOICE',
        topicId: topicTributario
      }
    ]
  });

  // 4. Materiais com Lives do YouTube (Revisões)
  await prisma.material.createMany({
    data: [
      {
        userId: user.id,
        title: 'Revisão de Véspera - Português CEBRASPE',
        content: 'Super revisão com foco nas pegadinhas de concordância do CESPE.',
        type: 'video',
        url: 'https://www.youtube.com/embed/z5s0xT5aZ1s', // URL de exemplo
        source: 'Gran Cursos'
      },
      {
        userId: user.id,
        title: 'Jurisprudência STF para FGV (Tributário)',
        content: 'Análise do Tema 69 e outros temas recorrentes na FGV.',
        type: 'video',
        url: 'https://www.youtube.com/embed/jfKfPfyJRdk', // URL de exemplo
        source: 'Estratégia Concursos'
      }
    ]
  });

  console.log('Seed concluído! Usuário Real, Questões de Bancas e Materiais YouTube inseridos.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
