import { Suspense } from 'react';
import { OpdForm } from './opd-form';

export const metadata = {
  title: 'Tambah OPD',
  description: 'Tambah Organisasi Perangkat Daerah baru',
};

export default function CreateOpdPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tambah OPD</h1>
        <p className="text-muted-foreground">Tambah Organisasi Perangkat Daerah baru ke sistem</p>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <OpdForm />
      </Suspense>
    </div>
  );
}
