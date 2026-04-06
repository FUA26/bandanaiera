import { Suspense } from 'react';
import { AgencyForm } from './agency-form';

export const metadata = {
  title: 'Edit Agency',
  description: 'Edit government agency',
};

export default function EditAgencyPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Agency</h1>
        <p className="text-muted-foreground">Update agency information</p>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <AgencyForm agencyId={params.id} />
      </Suspense>
    </div>
  );
}
