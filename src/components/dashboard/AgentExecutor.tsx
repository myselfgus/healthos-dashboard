import React, { useState, useMemo } from 'react';
import { Play, Loader2, LucideIcon } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { mockAgents } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
export const AgentExecutor = () => {
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const runAction = useAppStore(s => s.runAction);
  const systemProcessing = useAppStore(s => s.systemProcessing);
  const isAiThinking = useAppStore(s => s.isAiThinking);
  const selectedAgent = useMemo(() => {
    return mockAgents.find(agent => agent.id === selectedAgentId) || null;
  }, [selectedAgentId]);
  const handleExecute = () => {
    if (selectedAgent) {
      runAction(selectedAgent.id, selectedAgent.title);
    }
  };
  const isProcessing = !!systemProcessing || isAiThinking;
  const isLoading = systemProcessing === selectedAgentId;
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Executor de Agentes</CardTitle>
        <CardDescription>Selecione e execute um pipeline de processamento.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-6">
        <div className="space-y-2">
          <Select onValueChange={setSelectedAgentId} disabled={isProcessing}>
            <SelectTrigger id="agent-selector">
              <SelectValue placeholder="Selecione um agente..." />
            </SelectTrigger>
            <SelectContent>
              {mockAgents.map(agent => (
                <SelectItem key={agent.id} value={agent.id}>
                  <div className="flex items-center gap-2">
                    <agent.icon size={16} className="text-muted-foreground" />
                    <span>{agent.title}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {selectedAgent && (
          <div className="flex-1 p-4 border rounded-lg bg-muted/50 space-y-3 animate-fade-in">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-foreground">{selectedAgent.title}</h3>
              {selectedAgent.tag && <Badge variant="secondary">{selectedAgent.tag}</Badge>}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {selectedAgent.desc}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleExecute}
          disabled={!selectedAgent || isProcessing}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processando...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Executar Agente
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};