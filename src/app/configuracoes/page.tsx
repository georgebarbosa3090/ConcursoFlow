"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { useState } from "react";
import { User, Bell, Shield, Moon, Globe, Save, ChevronRight, GraduationCap, Clock } from "lucide-react";

export default function ConfiguracoesPage() {
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [temaEscuro, setTemaEscuro] = useState(false);
  const [idioma, setIdioma] = useState("pt-BR");
  const [nome, setNome] = useState("Usuário Demo");
  const [metaDiaria, setMetaDiaria] = useState("2");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? "bg-blue-600" : "bg-slate-200"}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`} />
    </button>
  );

  const Section = ({ title, icon: Icon, children }: { title: string; icon: React.ComponentType<{ size?: number; className?: string }>; children: React.ReactNode }) => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <Icon size={18} className="text-blue-600" />
        <h3 className="font-bold text-slate-900">{title}</h3>
      </div>
      <div className="divide-y divide-slate-50">{children}</div>
    </div>
  );

  const Row = ({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) => (
    <div className="flex items-center justify-between px-6 py-4">
      <div>
        <p className="font-medium text-slate-900 text-sm">{label}</p>
        {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  );

  return (
    <MainLayout>
      <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Configurações</h2>
          <p className="text-slate-500 mt-1">Personalize sua experiência de estudo.</p>
        </div>

        {/* Perfil */}
        <Section title="Perfil" icon={User}>
          <Row label="Nome completo" description="Exibido no dashboard e nos relatórios">
            <input
              type="text"
              value={nome}
              onChange={e => setNome(e.target.value)}
              className="w-48 px-3 py-1.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </Row>
          <Row label="Email" description="Usado para login e notificações">
            <span className="text-sm text-slate-500 font-mono">demo@demo.com</span>
          </Row>
          <Row label="Plano" description="Plano atual de acesso">
            <span className="text-xs font-bold bg-blue-100 text-blue-800 px-3 py-1 rounded-full border border-blue-200">Pro — Demonstração</span>
          </Row>
        </Section>

        {/* Estudo */}
        <Section title="Metas de Estudo" icon={GraduationCap}>
          <Row label="Meta diária de horas" description="Horas de estudo que o motor adaptativo vai planejar por dia">
            <select
              value={metaDiaria}
              onChange={e => setMetaDiaria(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="1">1 hora</option>
              <option value="2">2 horas</option>
              <option value="3">3 horas</option>
              <option value="4">4 horas</option>
              <option value="6">6 horas</option>
            </select>
          </Row>
          <Row label="Revisão espaçada automática" description="O motor SM-2 ajusta seus intervalos de revisão automaticamente">
            <Toggle checked={true} onChange={() => {}} />
          </Row>
          <Row label="Modo foco (sem distrações)" description="Oculta notificações durante sessões de estudo">
            <Toggle checked={false} onChange={() => {}} />
          </Row>
        </Section>

        {/* Notificações */}
        <Section title="Notificações" icon={Bell}>
          <Row label="Notificações por e-mail" description="Lembretes de sessões e relatórios semanais">
            <Toggle checked={notifEmail} onChange={() => setNotifEmail(!notifEmail)} />
          </Row>
          <Row label="Notificações push" description="Alertas no navegador quando houver revisões vencidas">
            <Toggle checked={notifPush} onChange={() => setNotifPush(!notifPush)} />
          </Row>
        </Section>

        {/* Aparência */}
        <Section title="Aparência e Idioma" icon={Moon}>
          <Row label="Tema escuro" description="Troca o tema da interface para dark mode">
            <Toggle checked={temaEscuro} onChange={() => setTemaEscuro(!temaEscuro)} />
          </Row>
          <Row label="Idioma" description="Idioma da interface">
            <select
              value={idioma}
              onChange={e => setIdioma(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="pt-BR">🇧🇷 Português (Brasil)</option>
              <option value="en-US">🇺🇸 English (US)</option>
            </select>
          </Row>
        </Section>

        {/* Segurança */}
        <Section title="Segurança" icon={Shield}>
          <Row label="Alterar senha" description="Redefina a senha de acesso à conta">
            <button className="flex items-center gap-1 text-sm text-blue-600 font-medium hover:underline">
              Alterar <ChevronRight size={14} />
            </button>
          </Row>
          <Row label="Autenticação de dois fatores (2FA)" description="Adiciona uma camada extra de segurança">
            <button className="flex items-center gap-1 text-sm text-blue-600 font-medium hover:underline">
              Configurar <ChevronRight size={14} />
            </button>
          </Row>
        </Section>

        {/* Salvar */}
        <div className="flex justify-end pb-8">
          <button
            id="save-settings"
            onClick={handleSave}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition shadow-sm ${
              saved
                ? "bg-green-600 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            <Save size={18} />
            {saved ? "Salvo com sucesso!" : "Salvar Configurações"}
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
