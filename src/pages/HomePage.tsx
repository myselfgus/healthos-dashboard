import React from 'react';
import { Moon, Sun, UploadCloud, AlertCircle, Settings } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { useAppStore, TabId } from '@/lib/store';
import { AppSidebar } from '@/components/app-sidebar';
import { DashboardView } from '@/components/dashboard/DashboardView';
import { PatientsView } from '@/components/patients/PatientsView';
import { cn } from '@/lib/utils';
const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme} className="shadow-neu-sm w-12 h-12 rounded-full flex items-center justify-center text-petrol transition-all duration-200 hover:-translate-y-0.5 active:shadow-neu-pressed">
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};
const HeaderButton = ({ icon: Icon, onClick }: { icon: React.ElementType, onClick: () => void }) => (
  <button onClick={onClick} className="shadow-neu-sm w-12 h-12 rounded-full flex items-center justify-center text-petrol transition-all duration-200 hover:-translate-y-0.5 active:shadow-neu-pressed">
    <Icon size={20} />
  </button>
);
const viewTitles: Record<TabId, string> = {
  dashboard: 'Visão Geral do Sistema',
  patients: 'Gestão de Pacientes',
  files: 'Arquivos do Sistema',
  settings: 'Configurações',
};
const PlaceholderView = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center h-full text-muted-foreground animate-fade-in">
    <Settings size={48} className="mb-4 opacity-20" />
    <p className="text-lg">{title}</p>
    <p className="text-sm">Módulo em construção...</p>
  </div>
);
export function HomePage() {
  const activeTab = useAppStore(s => s.activeTab);
  const addLog = useAppStore(s => s.addLog);
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'patients':
        return <PatientsView />;
      default:
        return <PlaceholderView title={viewTitles[activeTab] || 'Página'} />;
    }
  };
  return (
    <div className="flex h-screen bg-[var(--app-bg)] text-[var(--text-main)] overflow-hidden font-sans">
      <AppSidebar />
      <main className="flex-1 flex flex-col min-w-0 p-6 pl-0">
        <header className="h-20 flex-shrink-0 flex items-center justify-between mb-2">
          <div>
            <h2 className="text-2xl font-bold text-petrol tracking-tight">
              {viewTitles[activeTab] || 'AuraDash'}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Bem-vindo ao MedScribe HealthOS</p>
          </div>
          <div className="flex gap-4">
            <HeaderButton icon={AlertCircle} onClick={() => addLog("Sistema auditado manualmente.")} />
            <HeaderButton icon={UploadCloud} onClick={() => addLog("Sincronização com nuvem iniciada.")} />
            <ThemeToggle />
          </div>
        </header>
        <div className="flex-1 overflow-hidden relative">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}