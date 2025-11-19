import React from 'react';
import { Users, Mic, FileText, Brain, FolderOpen, Activity, Network, ShieldCheck } from 'lucide-react';
import { StatCard } from './StatCard';
import { ActionCard } from './ActionCard';
import { ChatCli } from './ChatCli';
import { useAppStore } from '@/lib/store';
import { Card } from '@/components/ui/card';
export const DashboardView = () => {
  const systemProcessing = useAppStore(s => s.systemProcessing);
  const isAiThinking = useAppStore(s => s.isAiThinking);
  const runAction = useAppStore(s => s.runAction);
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" style={{ height: 'calc(100vh - 300px)'}}>
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto pr-2 custom-scroll pb-4">
          <ActionCard title="Transcrever Áudio" desc="Pipeline ElevenLabs STT com diarização automática de falantes para arquivos na pasta /audio." icon={Mic} tag="V1.0" loading={systemProcessing === 'transcribe'} onClick={() => runAction('transcribe', 'Transcrição de Áudio')} />
          <ActionCard title="Processar Dossiês" desc="Extração de metadados, conferência e organização de pastas para novos pacientes." icon={FolderOpen} tag="AUTO" loading={systemProcessing === 'process'} onClick={() => runAction('process', 'Processamento de Dossiês')} />
          <ActionCard title="Análise ASL" desc="Análise Sistêmica Linguística (Psicolinguística) utilizando Claude Sonnet 4.5." icon={Brain} tag="SONNET" loading={systemProcessing === 'asl'} onClick={() => runAction('asl', 'Análise ASL')} />
          <ActionCard title="Dimensional (ℳ)" desc="Extração das 15 dimensões do espaço mental: Afetiva, Cognitiva e Linguística." icon={Activity} tag="15-DIM" loading={systemProcessing === 'dim'} onClick={() => runAction('dim', 'Análise Dimensional')} />
          <ActionCard title="Grafo GEM" desc="Geração de Grafos do Espaço-Campo Mental (AJE + IRE + E) para visualização topológica." icon={Network} tag="GRAPH" loading={systemProcessing === 'gem'} onClick={() => runAction('gem', 'Geração de Grafo GEM')} />
          <ActionCard title="Anonimizar" desc="Pipeline de seguran��a para remover PII de transcrições e análises antes do upload." icon={ShieldCheck} tag="PRIVACY" loading={systemProcessing === 'anon'} onClick={() => runAction('anon', 'Anonimização de Dados')} />
        </div>
        <div className="lg:col-span-1 h-full flex flex-col">
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
            <span className="text-[10px] text-muted-foreground">v2.5.0-genai</span>
          </Card>
        </div>
      </div>
    </div>
  );
};