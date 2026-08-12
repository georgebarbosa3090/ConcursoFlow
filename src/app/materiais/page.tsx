import { MainLayout } from "@/components/layout/main-layout";
import { BookOpen, FileText, Brain, Video, Plus, Search, Bot } from "lucide-react";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

const tipoIcon = {
  "PDF": FileText,
  "Mapa Mental": Brain,
  "Resumo": BookOpen,
  "Vídeo": Video,
};

const tipoCor = {
  "PDF": "bg-red-50 text-red-700 border-red-100",
  "Mapa Mental": "bg-purple-50 text-purple-700 border-purple-100",
  "Resumo": "bg-blue-50 text-blue-700 border-blue-100",
  "Vídeo": "bg-orange-50 text-orange-700 border-orange-100",
};

export default async function MateriaisPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect("/login");
  }

  // Busca materiais salvos pelo usuário no banco de dados
  let materiais = await prisma.material.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' }
  });



  return (
    <MainLayout>
      <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Materiais de Estudo</h2>
            <p className="text-slate-500">Apostilas, resumos e mapas mentais gerados pela IA ou importados.</p>
          </div>
          <Link href="/materiais/gerar" className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:opacity-90 transition shadow-md shadow-blue-500/20">
            <Bot size={18} /> Gerar Apostila IA
          </Link>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Buscar material por título ou disciplina…"
            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {materiais.length === 0 ? (
            <div className="md:col-span-2 text-center py-12 text-slate-500 bg-white rounded-xl border border-slate-200">
              <p>Nenhum material de estudo encontrado.</p>
              <p className="text-sm">Configure seu edital para que a IA sugira e crie resumos focados.</p>
            </div>
          ) : (
            materiais.map((mat: any) => {
              const tipoStr = mat.type as string;
              const Icon = tipoIcon[tipoStr as keyof typeof tipoIcon] ?? FileText;
              const cor = tipoCor[tipoStr as keyof typeof tipoCor] ?? "bg-slate-100 text-slate-700 border-slate-200";
              const progresso = mat.progresso ?? 0;
              
              return (
                <div key={mat.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all p-5 flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-slate-900 leading-snug">{mat.title}</h3>
                      <p className="text-sm text-slate-500 mt-1">{mat.disciplina || "Geral"} • {mat.paginas || 10} páginas</p>
                    </div>
                    <span className={`shrink-0 flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-full border ${cor}`}>
                      <Icon size={13} /> {tipoStr}
                    </span>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                      <span>Progresso</span>
                      <span className={progresso === 100 ? "text-green-600 font-bold" : ""}>{progresso}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${progresso === 100 ? "bg-green-500" : "bg-blue-500"}`}
                        style={{ width: `${progresso}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <Link href={`/materiais/ler/${mat.id}`} className="flex-1 flex justify-center items-center py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition">
                      {progresso === 0 ? "Iniciar Leitura" : progresso === 100 ? "Revisar" : "Continuar"}
                    </Link>
                    <button className="px-3 py-2 text-slate-500 hover:text-slate-800 border border-slate-200 hover:border-slate-300 rounded-lg transition" title="Criar Flashcards com IA">
                      <Brain size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </MainLayout>
  );
}
