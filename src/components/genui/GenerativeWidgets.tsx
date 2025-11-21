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
    <Card className="w-full max-w-md animate-scale-in shadow-neomorph hover:shadow-neomorph-lg transition-shadow duration-300 backdrop-blur-sm bg-card/80">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 rounded-xl shadow-neomorph-inset bg-background/50">
              <User className="h-5 w-5 text-primary" />
            </div>
            Resumo do Paciente
          </CardTitle>
          <Badge variant={statusVariant[data.status] || 'outline'} className="shadow-neomorph-sm px-3 py-1">{data.status}</Badge>
        </div>
        <CardDescription className="mt-2 font-medium">{data.name} - ID: {data.id}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {data.metrics.map((metric, index) => (
          <div key={index} className="flex justify-between text-sm p-2 rounded-lg shadow-neomorph-sm hover:shadow-neomorph transition-shadow">
            <span className="text-muted-foreground font-medium">{metric.label}</span>
            <span className="font-semibold text-foreground">{metric.value}</span>
          </div>
        ))}
        <p className="text-xs text-muted-foreground pt-2 pl-2">Última atualização: {data.lastUpdate}</p>
      </CardContent>
    </Card>
  );
};
export const VitalsChartWidget = ({ data }: { data: VitalsChartData }) => (
  <Card className="w-full max-w-md animate-scale-in shadow-neomorph hover:shadow-neomorph-lg transition-shadow duration-300 backdrop-blur-sm bg-card/80">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-lg">
        <div className="p-2 rounded-xl shadow-neomorph-inset bg-background/50">
          <Activity className="h-5 w-5 text-primary" />
        </div>
        {data.title}
      </CardTitle>
      <CardDescription className="mt-2 font-medium">Histórico de métricas do paciente.</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="h-48 w-full p-3 rounded-xl shadow-neomorph-inset bg-background/30">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data.data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
                color: 'hsl(var(--foreground))',
                borderRadius: '12px',
                boxShadow: '1px 1px 1px 0 rgba(0, 0, 0, 0.7)'
              }}
            />
            <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
);
export const ActionPlanWidget = ({ data }: { data: ActionPlanData }) => (
  <Card className="w-full max-w-md animate-scale-in shadow-neomorph hover:shadow-neomorph-lg transition-shadow duration-300 backdrop-blur-sm bg-card/80">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-lg">
        <div className="p-2 rounded-xl shadow-neomorph-inset bg-background/50">
          <ListChecks className="h-5 w-5 text-primary" />
        </div>
        {data.title}
      </CardTitle>
      <CardDescription className="mt-2 font-medium">Próximos passos e recomendações.</CardDescription>
    </CardHeader>
    <CardContent className="space-y-3">
      {data.steps.map((step) => (
        <div key={step.id} className="flex items-center space-x-3 p-3 rounded-xl shadow-neomorph-sm hover:shadow-neomorph transition-all duration-200 bg-background/30">
          <Checkbox id={step.id} checked={step.completed} className="shadow-neomorph-inset" />
          <label
            htmlFor={step.id}
            className={cn("text-sm font-medium leading-none cursor-pointer", step.completed && "line-through text-muted-foreground")}
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