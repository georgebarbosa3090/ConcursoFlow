"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, CheckSquare, BarChart3, Bot } from "lucide-react";

const mobileRoutes = [
  { label: "Início",     href: "/",            icon: Home },
  { label: "Plano",      href: "/plano",        icon: Calendar },
  { label: "Questões",   href: "/questoes",     icon: CheckSquare },
  { label: "Analytics",  href: "/desempenho",   icon: BarChart3 },
  { label: "Agente IA",  href: "/agente-bancas",icon: Bot },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 w-full bg-white/95 backdrop-blur border-t border-slate-200 flex justify-around items-center h-16 z-50 safe-area-pb">
      {mobileRoutes.map((route) => {
        const isActive = pathname === route.href || (route.href !== "/" && pathname.startsWith(route.href));
        return (
          <Link
            key={route.href}
            href={route.href}
            className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors ${
              isActive ? "text-blue-600" : "text-slate-400 hover:text-slate-700"
            }`}
          >
            <route.icon size={20} className={isActive ? "text-blue-600" : ""} />
            <span className="text-[10px] font-medium">{route.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
