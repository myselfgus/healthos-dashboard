import React from 'react';
import { LucideIcon, Play, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
interface ActionCardProps {
  title: string;
  desc: string;
  icon: LucideIcon;
  onClick: () => void;
  loading: boolean;
  tag?: string;
}
export const ActionCard = ({ title, desc, icon: Icon, onClick, loading, tag }: ActionCardProps) => (
  <Card className="flex flex-col">
    <CardHeader className="flex flex-row items-start justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-primary">
          <Icon size={24} />
        </div>
        <div>
          <CardTitle>{title}</CardTitle>
        </div>
      </div>
      {tag && <Badge variant="outline">{tag}</Badge>}
    </CardHeader>
    <CardContent className="flex-1">
      <p className="text-sm text-muted-foreground leading-relaxed">
        {desc}
      </p>
    </CardContent>
    <CardFooter>
      <Button
        onClick={onClick}
        disabled={loading}
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processando...
          </>
        ) : (
          <>
            <Play className="mr-2 h-4 w-4" />
            Executar
          </>
        )}
      </Button>
    </CardFooter>
  </Card>
);