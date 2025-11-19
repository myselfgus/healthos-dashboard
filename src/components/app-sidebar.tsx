import React from 'react';
import {
  Activity, Mic, Brain, Network, Database, Settings, Users, FolderOpen, LucideIcon } from
'lucide-react';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Logo = () =>
<div className="flex flex-col items-center p-6 select-none">
    <div className="relative w-16 h-16 flex items-center justify-center bg-primary/10 rounded-full border-4 border-background">
      <div className="z-10 text-primary font-bold text-3xl tracking-wider">V</div>
    </div>
    <h1 className="mt-4 text-xl font-bold tracking-[0.2em] text-foreground">MEDSCRIBE</h1>
    <div className="text-xs tracking-widest text-muted-foreground uppercase mt-1 font-medium">Voither HealthOS</div>
  </div>;

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick: () => void;
  badge?: string;
}
const NavItem = ({ icon: Icon, label, active, onClick, badge }: NavItemProps) =>
<Button
  onClick={onClick}
  variant={active ? 'secondary' : 'ghost'}
  className="w-full justify-start gap-3 px-4 py-2 h-auto text-sm mb-1">

    <Icon size={20} className="text-muted-foreground" />
    <span className="flex-1 text-left">{label}</span>
    {badge &&
  <span className="text-[10px] font-bold bg-accent text-accent-foreground px-2 py-0.5 rounded-full">
        {badge}
      </span>
  }
  </Button>;

export function AppSidebar(): JSX.Element {
  const activeTab = useAppStore((s) => s.activeTab);
  const setActiveTab = useAppStore((s) => s.setActiveTab);
  const runAction = useAppStore((s) => s.runAction);
  return (
    <aside className="w-64 flex-shrink-0 flex flex-col bg-muted/30 border-r">
      <Logo />
      <div className="flex-1 overflow-y-auto custom-scroll px-4">
        <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 pl-4">Menu Principal</div>
        <NavItem icon={Activity} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
        <NavItem icon={Users} label="Pacientes" active={activeTab === 'patients'} onClick={() => setActiveTab('patients')} badge="24" />
        <NavItem icon={FolderOpen} label="Arquivos" active={activeTab === 'files'} onClick={() => setActiveTab('files')} />
        <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 mt-6 pl-4">Pipeline</div>
        <NavItem icon={Mic} label="Transcrição" onClick={() => runAction('transcribe', 'Transcrição de Áudio')} />
        <NavItem icon={Brain} label="Psicolinguística" onClick={() => runAction('asl', 'Análise ASL')} />
        <NavItem icon={Network} label="Grafos GEM" onClick={() => runAction('gem', 'Geração de Grafo GEM')} />
        <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 mt-6 pl-4">Sistema</div>
        <NavItem icon={Database} label="MongoDB Atlas" onClick={() => runAction('db', 'Verificar Banco de Dados')} />
        <NavItem icon={Settings} label="Configurações" onClick={() => setActiveTab('settings')} />
      </div>
      <div className="mt-auto p-4 border-t">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>DR</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <div className="text-sm font-bold text-foreground truncate">Dr. Voither</div>
            <div className="text-xs text-muted-foreground truncate">CRM/SP 123.456</div>
          </div>
        </div>
      </div>
    </aside>);

}