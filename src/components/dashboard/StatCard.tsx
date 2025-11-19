import React from 'react';
import { Activity, LucideIcon } from 'lucide-react';
interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  trend: string;
}
export const StatCard = ({ icon: Icon, label, value, trend }: StatCardProps) => (
  <div className="shadow-neu rounded-2xl p-5 flex flex-col justify-between min-h-[140px] relative overflow-hidden group border border-transparent hover:border-white/50 transition-all duration-300">
    <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-transparent to-white/40 dark:to-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 rounded-xl shadow-neu-inset text-petrol">
        <Icon size={24} />
      </div>
      <div className="flex items-center gap-1 text-xs font-medium text-moss bg-moss/10 px-2 py-1 rounded-lg">
        <Activity size={12} />
        {trend}
      </div>
    </div>
    <div>
      <div className="text-3xl font-bold text-petrol mb-1">{value}</div>
      <div className="text-sm text-muted-foreground font-medium">{label}</div>
    </div>
  </div>
);