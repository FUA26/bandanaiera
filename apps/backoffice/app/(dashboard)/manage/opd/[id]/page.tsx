import { Suspense } from 'react';
import { OpdForm } from './opd-form';
import { ProtectedRoute } from '@/components/rbac/ProtectedRoute';

export const metadata = {
  title: 'Ubah OPD',
  description: 'Ubah informasi OPD',
};

function EditOpdContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ubah OPD</h1>
        <p className="text-muted-foreground">Update informasi OPD</p>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <OpdForm />
      </Suspense>
    </div>
  );
}

export default function EditOpdPage() {
  return (
    <ProtectedRoute permissions={["OPD_EDIT"]}>
      <EditOpdContent />
    </ProtectedRoute>
  );
}
