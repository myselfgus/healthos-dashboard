import React from 'react';
import { GenUIAssistant } from '@/components/ai-assistant/GenUIAssistant';
import { useAppStore } from '@/lib/store';
import { Card } from '@/components/ui/card';
export const AiAssistantView = () => {
  const systemProcessing = useAppStore(s => s.systemProcessing);
  const isAiThinking = useAppStore(s => s.isAiThinking);
  const isProcessing = !!systemProcessing || isAiThinking;
  const statusText = systemProcessing ? 'PROCESSANDO...' : isAiThinking ? 'IA PENSANDO...' : 'SISTEMA PRONTO';
  return (
    <div className="h-full flex flex-col animate-fade-in">
      <div className="flex-1 overflow-hidden">
        <GenUIAssistant />
      </div>
      <Card className="mt-6 p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isProcessing ? 'bg-yellow-400 animate-pulse' : 'bg-green-500'}`}></div>
          <span className="text-xs font-bold text-foreground uppercase tracking-wide">
            {statusText}
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground">v3.0.0-genui</span>
      </Card>
    </div>
  );
};