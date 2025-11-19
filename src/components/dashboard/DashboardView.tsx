import React from 'react';
import { AgentExecutor } from './AgentExecutor';
import { AgentStatusWidget } from './AgentStatusWidget';
import { AppointmentsWidget } from './AppointmentsWidget';
import { VideoCallWidget } from './VideoCallWidget';
export const DashboardView = () => {
  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-8">
          <AgentExecutor />
          <VideoCallWidget />
        </div>
        <div className="space-y-8">
          <AgentStatusWidget />
          <AppointmentsWidget />
        </div>
      </div>
    </div>
  );
};