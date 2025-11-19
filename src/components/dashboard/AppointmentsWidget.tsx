import React from 'react';
import { mockAppointments } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
export const AppointmentsWidget = () => {
  const hasAppointments = mockAppointments && mockAppointments.length > 0;
  return (
    <Sheet>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Próximas Consultas</CardTitle>
            <CardDescription>Sessões agendadas para os próximos dias.</CardDescription>
          </div>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" disabled={!hasAppointments}>Ver Agenda</Button>
          </SheetTrigger>
        </CardHeader>
        <CardContent>
          {hasAppointments ? (
            <div className="space-y-4">
              {mockAppointments.slice(0, 4).map((appt, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="font-semibold text-sm">{appt.patient}</span>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {appt.date}</span>
                    <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {appt.time}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center text-muted-foreground py-8">
              <Calendar className="h-10 w-10 mb-4 opacity-50" />
              <p className="font-medium">Nenhuma consulta agendada</p>
              <p className="text-xs">A agenda está livre no momento.</p>
            </div>
          )}
        </CardContent>
      </Card>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Agenda Completa</SheetTitle>
          <SheetDescription>
            Todas as consultas agendadas no sistema.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-4">
          {mockAppointments.map((appt, index) => (
            <div key={index} className="flex items-start gap-4 p-4 rounded-lg border">
              <div className="p-2 bg-primary/10 text-primary rounded-full mt-1">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">{appt.patient}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {appt.date}</span>
                  <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {appt.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};