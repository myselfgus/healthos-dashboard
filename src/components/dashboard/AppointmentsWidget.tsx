import React from 'react';
import { mockAppointments } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
export const AppointmentsWidget = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Próximas Consultas</CardTitle>
          <CardDescription>Sessões agendadas para os próximos dias.</CardDescription>
        </div>
        <Button variant="outline" size="sm">Ver Agenda</Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockAppointments.map((appt, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <span className="font-semibold text-sm">{appt.patient}</span>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {appt.date}</span>
                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {appt.time}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};