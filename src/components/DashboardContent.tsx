
import React from 'react';
import { DashboardOverview } from './DashboardOverview';
import { DataTable } from './DataTable';

interface DashboardContentProps {
  activeModule: string;
}

export const DashboardContent: React.FC<DashboardContentProps> = ({ activeModule }) => {
  if (activeModule === 'dashboard') {
    return <DashboardOverview />;
  }

  return <DataTable module={activeModule} />;
};
