import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { User, Activity, ListChecks } from 'lucide-react';
import { cn } from '@/lib/utils';
// --- TYPE DEFINITIONS ---
export interface PatientSummaryData {
  name: string;
  id: string;
  lastUpdate: string;
  status: 'ATIVO' | 'EM OBS' | 'INATIVO';
  metrics: { label: string; value: string | number }[];
}
export interface VitalsChartData {
  title: string;
  data: { name: string; value: number }[];
}
export interface ActionPlanData {
  title: string;
  steps: { id: string; description: string; completed: boolean }[];
}
export type GenUIComponent =
  | { type: 'patient_summary'; data: PatientSummaryData }
  | { type: 'vitals_chart'; data: VitalsChartData }
  | { type: 'action_plan'; data: ActionPlanData };
// --- WIDGET COMPONENTS ---
export const PatientSummaryWidget = ({ data }: { data: PatientSummaryData }) => {
  const statusVariant = {
    'ATIVO': 'default',
    'EM OBS': 'secondary',
    'INATIVO': 'destructive',
  } as const;
  return (
    <Card className="w-full max-w-md animate-scale-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Resumo do Paciente
          </CardTitle>
          <Badge variant={statusVariant[data.status] || 'outline'}>{data.status}</Badge>
        </div>
        <CardDescription>{data.name} - ID: {data.id}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {data.metrics.map((metric, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span className="text-muted-foreground">{metric.label}</span>
            <span className="font-medium">{metric.value}</span>
          </div>
        ))}
        <p className="text-xs text-muted-foreground pt-2">Última atualização: {data.lastUpdate}</p>
      </CardContent>
    </Card>
  );
};
export const VitalsChartWidget = ({ data }: { data: VitalsChartData }) => (
  <Card className="w-full max-w-md animate-scale-in">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Activity className="h-5 w-5" />
        {data.title}
      </CardTitle>
      <CardDescription>Histórico de métricas do paciente.</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data.data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
                color: 'hsl(var(--foreground))'
              }}
            />
            <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorValue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
);
export const ActionPlanWidget = ({ data }: { data: ActionPlanData }) => (
  <Card className="w-full max-w-md animate-scale-in">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <ListChecks className="h-5 w-5" />
        {data.title}
      </CardTitle>
      <CardDescription>Próximos passos e recomendações.</CardDescription>
    </CardHeader>
    <CardContent className="space-y-3">
      {data.steps.map((step) => (
        <div key={step.id} className="flex items-center space-x-3">
          <Checkbox id={step.id} checked={step.completed} />
          <label
            htmlFor={step.id}
            className={cn("text-sm font-medium leading-none", step.completed && "line-through text-muted-foreground")}
          >
            {step.description}
          </label>
        </div>
      ))}
    </CardContent>
  </Card>
);
// --- DYNAMIC RENDERER ---
export const GenUIRenderer = ({ component }: { component: GenUIComponent }) => {
  switch (component.type) {
    case 'patient_summary':
      return <PatientSummaryWidget data={component.data} />;
    case 'vitals_chart':
      return <VitalsChartWidget data={component.data} />;
    case 'action_plan':
      return <ActionPlanWidget data={component.data} />;
    default:
      return null;
  }
};