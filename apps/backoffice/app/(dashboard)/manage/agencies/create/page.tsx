import { Suspense } from 'react';
import { AgencyForm } from './agency-form';

export const metadata = {
  title: 'Create Agency',
  description: 'Create a new government agency',
};

export default function CreateAgencyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Agency</h1>
        <p className="text-muted-foreground">Add a new government agency to the system</p>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <AgencyForm />
      </Suspense>
    </div>
  );
}
