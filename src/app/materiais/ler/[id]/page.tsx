import { MainLayout } from "@/components/layout/main-layout";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Printer, FileDown } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default async function LerMaterialPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect("/login");
  }

  const material = await prisma.material.findUnique({
    where: { id: params.id }
  });

  if (!material || material.userId !== session.user.id) {
    return notFound();
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        
        {/* Barra superior de ações */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <Link href="/materiais" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition font-medium">
            <ArrowLeft size={18} /> Voltar aos Materiais
          </Link>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 transition px-3 py-1.5 rounded-lg hover:bg-slate-100 font-medium text-sm">
              <Printer size={16} /> Imprimir
            </button>
            <button className="flex items-center gap-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 transition px-3 py-1.5 rounded-lg font-bold text-sm">
              <FileDown size={16} /> Salvar PDF
            </button>
          </div>
        </div>

        {/* Sala de Leitura (Papel) */}
        <article className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200 min-h-[800px]">
          <div className="prose prose-slate prose-blue max-w-none prose-headings:font-bold prose-a:text-blue-600 prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:not-italic prose-blockquote:text-slate-700">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {material.content}
            </ReactMarkdown>
          </div>
        </article>

      </div>
    </MainLayout>
  );
}
