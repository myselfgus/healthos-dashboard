import React from 'react';
import { LucideIcon, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
interface ActionCardProps {
  title: string;
  desc: string;
  icon: LucideIcon;
  onClick: () => void;
  loading: boolean;
  tag?: string;
}
export const ActionCard = ({ title, desc, icon: Icon, onClick, loading, tag }: ActionCardProps) => (
  <div className="shadow-neu rounded-2xl p-6 flex flex-col h-full relative border border-transparent hover:border-white/50 transition-all duration-300">
    {tag && (
      <div className="absolute top-4 right-4 text-[10px] font-bold tracking-wider text-muted-foreground border border-border px-2 py-0.5 rounded">
        {tag}
      </div>
    )}
    <div className="flex items-center gap-4 mb-4">
      <div className="w-12 h-12 rounded-2xl shadow-neu flex items-center justify-center text-petrol">
        <Icon size={24} />
      </div>
      <h3 className="text-lg font-bold text-petrol">{title}</h3>
    </div>
    <p className="text-sm text-muted-foreground mb-6 flex-1 leading-relaxed">
      {desc}
    </p>
    <button
      onClick={onClick}
      disabled={loading}
      className={cn(
        'shadow-neu-sm w-full py-3 text-sm font-bold uppercase tracking-wide flex items-center justify-center gap-2 rounded-xl transition-all duration-200 text-petrol',
        'hover:enabled:-translate-y-0.5 hover:enabled:text-moss',
        'active:shadow-neu-pressed active:translate-y-0',
        'disabled:opacity-60 disabled:cursor-not-allowed',
        loading && 'shadow-neu-pressed'
      )}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-petrol border-t-transparent rounded-full animate-spin"></div>
          Processando...
        </>
      ) : (
        <>
          <Play size={16} />
          Executar
        </>
      )}
    </button>
  </div>
);