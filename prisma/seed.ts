import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Iniciando o Seed de Demonstração...');

  // Limpar tabelas existentes se necessário, ou usar upsert. 
  // O Prisma faz upsert para evitar duplicação.
  
  // 1. Criar Usuário Demo
  const user = await prisma.user.upsert({
    where: { email: 'demo@demo.com' },
    update: {},
    create: {
      email: 'demo@demo.com',
      name: 'Usuário Demo',
      password: 'hashed_password', // No mundo real seria bcrypt
      role: 'STUDENT',
    },
  })

  // 2. Criar Concurso Demo
  const exam = await prisma.exam.create({
    data: {
      title: 'Polícia Federal 2026 - Agente',
      agency: 'Polícia Federal',
      board: 'Cebraspe',
      status: 'OPEN',
      userId: user.id,
      subjects: {
        create: [
          {
            name: 'Língua Portuguesa',
            weight: 1.0,
            topics: {
              create: [
                {
                  name: 'Compreensão de Textos',
                  skills: {
                    create: [{ name: 'Interpretação literal' }, { name: 'Inferência' }]
                  }
                },
                {
                  name: 'Sintaxe',
                  skills: {
                    create: [{ name: 'Concordância' }, { name: 'Regência' }]
                  }
                }
              ]
            }
          },
          {
            name: 'Informática',
            weight: 1.5,
            topics: {
              create: [
                {
                  name: 'Redes de Computadores',
                  skills: {
                    create: [{ name: 'Protocolos TCP/IP' }, { name: 'Topologias' }]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  })

  // 3. Criar Questões Demo
  await prisma.question.create({
    data: {
      text: 'O protocolo HTTP atua em qual camada do modelo OSI?',
      options: ['Física', 'Rede', 'Transporte', 'Aplicação', 'Apresentação'],
      correctOption: 3,
      explanation: 'O HTTP é um protocolo de Aplicação.',
    }
  })

  console.log('Seed concluído com sucesso! Usuário, Concurso e Questões demonstrativas criados.');
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
