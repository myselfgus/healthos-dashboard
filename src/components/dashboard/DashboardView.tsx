import React from 'react';
import { Users, Mic, FileText, Brain, FolderOpen, Activity, Network, ShieldCheck } from 'lucide-react';
import { StatCard } from './StatCard';
import { ActionCard } from './ActionCard';
import { TerminalView } from './TerminalView';
import { useAppStore } from '@/lib/store';
export const DashboardView = () => {
  const logs = useAppStore(s => s.logs);
  const processing = useAppStore(s => s.processing);
  const runAction = useAppStore(s => s.runAction);
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Users} label="Pacientes Ativos" value="24" trend="+2 esta sem." />
        <StatCard icon={Mic} label="Áudios Pendentes" value="08" trend="Aguardando" />
        <StatCard icon={FileText} label="Transcrições" value="156" trend="Total" />
        <StatCard icon={Brain} label="Análises ASL" value="142" trend="98% processado" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[500px]">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto pr-2 custom-scroll pb-4">
          <ActionCard title="Transcrever Áudio" desc="Pipeline ElevenLabs STT com diarização automática de falantes para arquivos na pasta /audio." icon={Mic} tag="V1.0" loading={processing === 'transcribe'} onClick={() => runAction('transcribe', 'Transcrição de Áudio')} />
          <ActionCard title="Processar Dossiês" desc="Extração de metadados, conferência e organização de pastas para novos pacientes." icon={FolderOpen} tag="AUTO" loading={processing === 'process'} onClick={() => runAction('process', 'Processamento de Dossiês')} />
          <ActionCard title="Análise ASL" desc="Análise Sistêmica Linguística (Psicolinguística) utilizando Claude Sonnet 4.5." icon={Brain} tag="SONNET" loading={processing === 'asl'} onClick={() => runAction('asl', 'Análise ASL')} />
          <ActionCard title="Dimensional (ℳ)" desc="Extração das 15 dimensões do espaço mental: Afetiva, Cognitiva e Linguística." icon={Activity} tag="15-DIM" loading={processing === 'dim'} onClick={() => runAction('dim', 'Análise Dimensional')} />
          <ActionCard title="Grafo GEM" desc="Geração de Grafos do Espaço-Campo Mental (AJE + IRE + E) para visualização topológica." icon={Network} tag="GRAPH" loading={processing === 'gem'} onClick={() => runAction('gem', 'Geração de Grafo GEM')} />
          <ActionCard title="Anonimizar" desc="Pipeline de segurança para remover PII de transcrições e análises antes do upload." icon={ShieldCheck} tag="PRIVACY" loading={processing === 'anon'} onClick={() => runAction('anon', 'Anonimização de Dados')} />
        </div>
        <div className="lg:col-span-1 h-full flex flex-col">
          <div className="shadow-neu rounded-2xl p-1 flex-1 overflow-hidden">
            <TerminalView logs={logs} />
          </div>
          <div className="mt-6 shadow-neu rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${processing ? 'bg-yellow-400 animate-pulse' : 'bg-green-500'}`}></div>
              <span className="text-xs font-bold text-petrol uppercase tracking-wide">
                {processing ? 'PROCESSANDO...' : 'SISTEMA PRONTO'}
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground">v2.4.0-stable</span>
          </div>
        </div>
      </div>
    </div>
  );
};