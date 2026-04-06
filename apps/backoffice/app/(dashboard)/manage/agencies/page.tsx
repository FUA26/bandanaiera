import { Suspense } from 'react';
import { AgenciesClient } from './agencies-client';

export const metadata = {
  title: 'Agencies',
  description: 'Manage government agencies',
};

export default function AgenciesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Agencies</h1>
        <p className="text-muted-foreground">Manage government agencies and their services</p>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <AgenciesClient />
      </Suspense>
    </div>
  );
}
