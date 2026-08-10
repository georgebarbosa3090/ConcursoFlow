import { MainLayout } from "@/components/layout/main-layout";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ConcursosPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  return (
    <MainLayout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Concursos</h2>
            <p className="text-slate-500">Gerencie seus editais e importações.</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors">
            + Importar Edital
          </button>
        </div>

        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-slate-500">Você ainda não possui concursos cadastrados.</p>
          <p className="text-sm text-slate-400 mt-2">Clique no botão acima para importar um edital via URL.</p>
        </div>
      </div>
    </MainLayout>
  );
}
