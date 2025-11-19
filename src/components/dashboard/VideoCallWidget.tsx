import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, Plus } from 'lucide-react';
export const VideoCallWidget = () => {
  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-primary/90 to-primary text-primary-foreground">
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full opacity-50"></div>
      <div className="absolute right-10 bottom-10 w-20 h-20 bg-white/10 rounded-full opacity-30"></div>
      <CardContent className="p-6 flex flex-col items-start justify-between h-full z-10">
        <div className="p-3 bg-white/20 rounded-lg mb-4">
          <Video className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h3 className="text-xl font-bold mb-2">Telemedicina Segura</h3>
          <p className="text-sm text-primary-foreground/80 mb-6">
            Inicie uma nova sessão de vídeo com um paciente de forma rápida e segura.
          </p>
          <Button variant="secondary" size="lg" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Iniciar Chamada
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};