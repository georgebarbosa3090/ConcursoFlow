"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { 
  LayoutDashboard, GraduationCap, Calendar, CheckSquare, 
  BarChart3, Settings, BookOpen, FileWarning, LogOut, Bot, Brain
} from "lucide-react";

const routes = [
  { label: "Dashboard",       href: "/",             icon: LayoutDashboard },
  { label: "Meu Itinerário",  href: "/plano",         icon: Calendar },
  { label: "Questões",        href: "/questoes",      icon: CheckSquare },
  { label: "Analytics",       href: "/desempenho",    icon: BarChart3 },
  { label: "Motor Adaptativo",href: "/adaptacao",     icon: Brain },
  { label: "Concursos",       href: "/concursos",     icon: GraduationCap },
  { label: "Materiais",       href: "/materiais",     icon: BookOpen },
  { label: "Agente Bancas",   href: "/agente-bancas", icon: Bot },
  { label: "Caderno de Erros",href: "/erros",         icon: FileWarning },
  { label: "Configurações",   href: "/configuracoes", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const userName = session?.user?.name || "Estudante";
  const userEmail = session?.user?.email || "";
  const initials = userName.substring(0, 2).toUpperCase();

  return (
    <aside className="hidden md:flex h-screen w-64 flex-col bg-slate-950 text-white border-r border-slate-800 fixed top-0 left-0 z-50 shadow-2xl">
      <div className="px-6 py-5 border-b border-slate-800">
        <h1 className="text-xl font-extrabold tracking-tight">
          <span className="text-blue-400">Concurso</span>
          <span className="text-white">Flow</span>
          <span className="text-blue-400">AI</span>
        </h1>
        <p className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-widest">Preparação Inteligente</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {routes.map((route) => {
          const isActive = pathname === route.href || (route.href !== "/" && pathname.startsWith(route.href));
          return (
            <Link
              key={route.href}
              href={route.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <route.icon size={18} className={isActive ? "text-white" : "text-slate-500"} />
              {route.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-800 bg-slate-950/50 backdrop-blur-md">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-inner">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{userName}</p>
            <p className="text-xs text-slate-400 truncate">{userEmail}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-red-400 hover:bg-slate-800/80 rounded-lg text-sm font-medium transition-colors"
        >
          <LogOut size={16} />
          Sair
        </button>
      </div>
    </aside>
  );
}
