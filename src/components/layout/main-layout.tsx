import { Sidebar } from "./sidebar";
import { BottomNav } from "./bottom-nav";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />
      {/* offset para a sidebar fixa no desktop */}
      <main className="flex-1 md:ml-64 overflow-y-auto pb-16 md:pb-0 min-h-screen">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
