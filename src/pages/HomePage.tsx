import React from 'react';
import { Moon, Sun, UploadCloud, AlertCircle, Settings } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { useAppStore, TabId } from '@/lib/store';
import { AppSidebar } from '@/components/app-sidebar';
import { DashboardView } from '@/components/dashboard/DashboardView';
import { PatientsView } from '@/components/patients/PatientsView';
import { FilesView } from '@/components/files/FilesView';
import { Button } from '@/components/ui/button';
const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();
  return (
    <Button onClick={toggleTheme} variant="ghost" size="icon">
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};
const HeaderButton = ({ icon: Icon, onClick }: { icon: React.ElementType, onClick: () => void }) => (
  <Button onClick={onClick} variant="ghost" size="icon">
    <Icon size={20} />
  </Button>
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
  const addChatMessage = useAppStore(s => s.addChatMessage);
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'patients':
        return <PatientsView />;
      case 'files':
        return <FilesView />;
      default:
        return <PlaceholderView title={viewTitles[activeTab] || 'Página'} />;
    }
  };
  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">
      <AppSidebar />
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 flex-shrink-0 flex items-center justify-between mb-2 px-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">
              {viewTitles[activeTab] || 'AuraDash'}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Bem-vindo ao MedScribe HealthOS</p>
          </div>
          <div className="flex items-center gap-2">
            <HeaderButton icon={AlertCircle} onClick={() => addChatMessage({role: 'system', content: "Auditoria manual do sistema solicitada."})} />
            <HeaderButton icon={UploadCloud} onClick={() => addChatMessage({role: 'system', content: "Sincronização com a nuvem iniciada."})} />
            <ThemeToggle />
          </div>
        </header>
        <div className="flex-1 overflow-auto p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}