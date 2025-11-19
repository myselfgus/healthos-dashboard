import React from 'react';
import {
  Activity, Mic, Brain, Network, Database, Settings, Users, FolderOpen, LucideIcon
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
const Logo = () => (
  <div className="flex flex-col items-center mb-8 mt-4 select-none">
    <div className="relative w-24 h-24 flex items-center justify-center">
      <div className="absolute inset-0 rounded-full shadow-neu animate-pulse-green opacity-50"></div>
      <div className="absolute inset-2 rounded-full border-2 border-petrol/10 animate-spin-slow"></div>
      <div className="absolute inset-6 rounded-full border border-moss/20 animate-spin-slow" style={{ animationDirection: 'reverse' }}></div>
      <div className="z-10 text-petrol font-bold text-2xl tracking-wider">V</div>
    </div>
    <h1 className="mt-4 text-xl font-bold tracking-[0.2em] text-petrol">MEDSCRIBE</h1>
    <div className="text-xs tracking-widest text-moss uppercase mt-1 font-medium">Voither HealthOS</div>
  </div>
);
interface NavItemProps {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick: () => void;
  badge?: string;
}
const NavItem = ({ icon: Icon, label, active, onClick, badge }: NavItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      'w-full flex items-center gap-3 px-4 py-3 mb-3 rounded-xl transition-all duration-200 text-sm',
      active
        ? 'shadow-neu-pressed text-petrol font-bold'
        : 'text-muted-foreground hover:text-petrol hover:translate-y-[-1px]'
    )}
  >
    <Icon size={20} className={cn(active && "text-petrol")} />
    <span className="flex-1 text-left">{label}</span>
    {badge && (
      <span className="text-[10px] font-bold bg-moss/10 text-moss px-2 py-0.5 rounded-full">
        {badge}
      </span>
    )}
  </button>
);
export function AppSidebar(): JSX.Element {
  const activeTab = useAppStore(s => s.activeTab);
  const setActiveTab = useAppStore(s => s.setActiveTab);
  const runAction = useAppStore(s => s.runAction);
  return (
    <aside className="w-64 flex-shrink-0 flex flex-col p-4">
      <Logo />
      <div className="flex-1 overflow-y-auto custom-scroll pr-2">
        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 pl-4">Menu Principal</div>
        <NavItem icon={Activity} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
        <NavItem icon={Users} label="Pacientes" active={activeTab === 'patients'} onClick={() => setActiveTab('patients')} badge="24" />
        <NavItem icon={FolderOpen} label="Arquivos" active={activeTab === 'files'} onClick={() => setActiveTab('files')} />
        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 mt-6 pl-4">Pipeline</div>
        <NavItem icon={Mic} label="Transcrição" onClick={() => runAction('transcribe', 'Transcrição de Áudio')} />
        <NavItem icon={Brain} label="Psicolinguística" onClick={() => runAction('asl', 'Análise ASL')} />
        <NavItem icon={Network} label="Grafos GEM" onClick={() => runAction('gem', 'Geração de Grafo GEM')} />
        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 mt-6 pl-4">Sistema</div>
        <NavItem icon={Database} label="MongoDB Atlas" onClick={() => runAction('db', 'Verificar Banco de Dados')} />
        <NavItem icon={Settings} label="Configurações" onClick={() => setActiveTab('settings')} />
      </div>
      <div className="mt-4 shadow-neu p-4 rounded-2xl flex items-center gap-3 cursor-pointer hover:-translate-y-0.5 transition-transform">
        <div className="w-10 h-10 rounded-full bg-petrol text-white flex items-center justify-center font-bold text-sm">DR</div>
        <div className="flex-1 overflow-hidden">
          <div className="text-sm font-bold text-petrol truncate">Dr. Voither</div>
          <div className="text-[10px] text-moss truncate">CRM/SP 123.456</div>
        </div>
      </div>
    </aside>
  );
}