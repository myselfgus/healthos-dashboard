import React from 'react';
import { Activity, LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  trend: string;
}
export const StatCard = ({ icon: Icon, label, value, trend }: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground flex items-center gap-1">
        <Activity size={12} className="text-moss" />
        <span className="text-moss font-semibold">{trend}</span>
      </p>
    </CardContent>
  </Card>
);