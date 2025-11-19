import React from 'react';
import { mockAgents } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
export const AgentStatusWidget = () => {
  const getStatusClass = (status: 'online' | 'busy' | 'offline') => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'busy':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-red-500';
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Status dos Agentes</CardTitle>
        <CardDescription>Disponibilidade dos pipelines de processamento.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockAgents.map((agent) => (
            <div key={agent.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <agent.icon className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium text-sm">{agent.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={cn("h-2 w-2 rounded-full", getStatusClass(agent.status))}></div>
                <span className="text-sm capitalize text-muted-foreground">{agent.status}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};