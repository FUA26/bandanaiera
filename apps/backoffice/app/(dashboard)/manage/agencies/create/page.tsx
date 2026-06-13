import { Suspense } from 'react';
import { AgencyForm } from './agency-form';

export const metadata = {
  title: 'Tambah Perangkat Daerah',
  description: 'Tambah perangkat daerah baru',
};

export default function CreateAgencyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tambah Perangkat Daerah</h1>
        <p className="text-muted-foreground">Tambah perangkat daerah baru ke sistem</p>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <AgencyForm />
      </Suspense>
    </div>
  );
}
