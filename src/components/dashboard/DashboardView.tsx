import React from 'react';
import { Users, Mic, FileText, Brain } from 'lucide-react';
import { StatCard } from './StatCard';
import { ChatCli } from './ChatCli';
import { AgentExecutor } from './AgentExecutor';
import { useAppStore } from '@/lib/store';
import { Card } from '@/components/ui/card';
export const DashboardView = () => {
  const systemProcessing = useAppStore(s => s.systemProcessing);
  const isAiThinking = useAppStore(s => s.isAiThinking);
  const isProcessing = !!systemProcessing || isAiThinking;
  const statusText = systemProcessing ? 'PROCESSANDO...' : isAiThinking ? 'IA PENSANDO...' : 'SISTEMA PRONTO';
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Users} label="Pacientes Ativos" value="24" trend="+2 esta sem." />
        <StatCard icon={Mic} label="Áudios Pendentes" value="08" trend="Aguardando" />
        <StatCard icon={FileText} label="Transcrições" value="156" trend="Total" />
        <StatCard icon={Brain} label="Análises ASL" value="142" trend="98% processado" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8" style={{ height: 'calc(100vh - 300px)'}}>
        <div className="lg:col-span-2 h-full flex flex-col">
          <AgentExecutor />
        </div>
        <div className="lg:col-span-3 h-full flex flex-col">
          <div className="flex-1 overflow-hidden">
            <ChatCli />
          </div>
          <Card className="mt-6 p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isProcessing ? 'bg-yellow-400 animate-pulse' : 'bg-green-500'}`}></div>
              <span className="text-xs font-bold text-foreground uppercase tracking-wide">
                {statusText}
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground">v2.6.0-genai</span>
          </Card>
        </div>
      </div>
    </div>
  );
};