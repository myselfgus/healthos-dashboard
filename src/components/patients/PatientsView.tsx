import React from 'react';
import { Search, Users, FileText, Brain } from 'lucide-react';
import { mockPatients } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
const PatientCard = ({ patient }) => {
  const statusColor = {
    'ATIVO': 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
    'EM OBS': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300',
    'INATIVO': 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
  };
  return (
    <div className="shadow-neu rounded-2xl p-5 cursor-pointer group hover:border-moss/30 transition-all duration-300 hover:-translate-y-1">
      <div className="flex justify-between items-start mb-3">
        <div className="w-10 h-10 rounded-full bg-petrol/10 flex items-center justify-center text-petrol">
          <Users size={20} />
        </div>
        <div className={cn("text-[10px] px-2 py-1 rounded font-bold", statusColor[patient.status])}>
          {patient.status}
        </div>
      </div>
      <h4 className="text-lg font-bold text-petrol">{patient.name}</h4>
      <p className="text-xs text-muted-foreground mb-4">Ultima atualização: {patient.lastUpdate}</p>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><FileText size={12} /> Transcrições</span>
          <span className="font-bold text-petrol">{patient.transcriptions}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><Brain size={12} /> Análises</span>
          <span className="font-bold text-petrol">{patient.analyses}</span>
        </div>
      </div>
    </div>
  );
};
export const PatientsView = () => (
  <div className="h-full flex flex-col animate-fade-in">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-petrol">Explorador de Dossiês</h2>
      <div className="relative w-64">
        <input
          type="text"
          placeholder="Buscar paciente..."
          className="shadow-neu-inset w-full py-2 pl-10 pr-4 text-sm focus:outline-none bg-transparent text-petrol placeholder-muted-foreground rounded-xl"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
      </div>
    </div>
    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-10 custom-scroll pr-2">
      {mockPatients.map(p => <PatientCard key={p.id} patient={p} />)}
    </div>
  </div>
);