# ConcursoFlow AI

Plataforma inteligente de aprendizagem adaptativa e preparação para concursos públicos. 
Esta aplicação converte editais em cronogramas personalizados e acompanha sua evolução em tempo real.

## 🚀 Tecnologias

- **Frontend & Backend (Monólito):** Next.js 14+ (App Router) com TypeScript
- **UI & Estilos:** Tailwind CSS, shadcn/ui e Lucide Icons
- **Banco de Dados:** PostgreSQL com Prisma ORM
- **Autenticação:** NextAuth.js (com sessão e JWT)
- **Containerização:** Docker Compose para banco de dados local

## 📦 Estrutura do Projeto

- `src/app`: Rotas e páginas (Dashboard, Login, Concursos)
- `src/components`: Componentes reutilizáveis (Layout, Botões, UI base)
- `src/lib`: Configurações de autenticação e instâncias de utilitários
- `prisma`: Schema do banco de dados e script de seed

## 🛠️ Como executar localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/georgebarbosa3090/ENEMFLOW26AI.git
   cd concursoflow-ai
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Suba o banco de dados via Docker:**
   É necessário ter o Docker e Docker Compose instalados no seu ambiente.
   ```bash
   docker compose up -d
   ```

4. **Inicie o banco de dados e os dados de demonstração (Seed):**
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

5. **Execute a aplicação em desenvolvimento:**
   ```bash
   npm run dev
   ```

6. **Acesso:**
   Acesse `http://localhost:3000`.
   Login demonstrativo: `demo@demo.com` | Senha: `123456`

## 💡 MVP - Primeira Entrega Obrigatória
- Layout base, autenticação e dashboard.
- Banco de dados provisionado via Prisma.
- Container Docker para Postgres (`docker-compose.yml`).
- Cadastro básico de concursos com importador de URL.
- Scripts de demonstração disponíveis.
