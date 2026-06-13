import { Suspense } from 'react';
import { AgencyForm } from './agency-form';

export const metadata = {
  title: 'Ubah Perangkat Daerah',
  description: 'Ubah informasi perangkat daerah',
};

export default function EditAgencyPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ubah Perangkat Daerah</h1>
        <p className="text-muted-foreground">Update informasi perangkat daerah</p>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <AgencyForm agencyId={params.id} />
      </Suspense>
    </div>
  );
}
