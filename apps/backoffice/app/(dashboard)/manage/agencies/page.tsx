import { Suspense } from 'react';
import { AgenciesClient } from './agencies-client';

export const metadata = {
  title: 'Perangkat Daerah',
  description: 'Kelola perangkat daerah dan layanan publik',
};

export default function AgenciesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Perangkat Daerah</h1>
        <p className="text-muted-foreground">Kelola perangkat daerah dan layanan publik</p>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <AgenciesClient />
      </Suspense>
    </div>
  );
}
