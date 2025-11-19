import React from 'react';
import { Search, Users, FileText, Brain, UserPlus } from 'lucide-react';
import { mockPatients } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
const PatientCard = ({ patient }) => {
  const statusVariant = {
    'ATIVO': 'default',
    'EM OBS': 'secondary',
    'INATIVO': 'destructive',
  } as const;
  return (
    <Card className="hover:border-primary/50 transition-colors duration-300 hover:shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start mb-3">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-primary">
            <Users size={20} />
          </div>
          <Badge variant={statusVariant[patient.status] || 'outline'}>
            {patient.status}
          </Badge>
        </div>
        <CardTitle className="text-lg">{patient.name}</CardTitle>
        <p className="text-xs text-muted-foreground pt-1">Ultima atualização: {patient.lastUpdate}</p>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5"><FileText size={14} /> Transcrições</span>
          <span className="font-bold text-foreground">{patient.transcriptions}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5"><Brain size={14} /> Análises</span>
          <span className="font-bold text-foreground">{patient.analyses}</span>
        </div>
      </CardContent>
    </Card>
  );
};
const EmptyState = () => (
  <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center text-center text-muted-foreground h-full py-16">
    <Users className="h-12 w-12 mb-4 opacity-50" />
    <h3 className="text-lg font-semibold text-foreground">Nenhum Paciente Encontrado</h3>
    <p className="mt-2 text-sm">
      O sistema não possui pacientes cadastrados no momento.
    </p>
    <Button className="mt-4">
      <UserPlus className="mr-2 h-4 w-4" /> Adicionar Paciente
    </Button>
  </div>
);
export const PatientsView = () => {
  const hasPatients = mockPatients && mockPatients.length > 0;
  return (
    <div className="h-full flex flex-col animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">Explorador de Dossiês</h2>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            type="text"
            placeholder="Buscar paciente..."
            className="w-full pl-10"
          />
        </div>
      </div>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-10 custom-scroll pr-2">
        {hasPatients ? (
          mockPatients.map(p => <PatientCard key={p.id} patient={p} />)
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};