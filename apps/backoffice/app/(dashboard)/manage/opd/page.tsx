import { Suspense } from 'react';
import { OpdClient } from './opd-client';
import { ProtectedRoute } from '@/components/rbac/ProtectedRoute';

export const metadata = {
  title: 'OPD',
  description: 'Kelola Organisasi Perangkat Daerah',
};

function OpdPageContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">OPD</h1>
        <p className="text-muted-foreground">Kelola Organisasi Perangkat Daerah</p>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <OpdClient />
      </Suspense>
    </div>
  );
}

export default function OpdPage() {
  return (
    <ProtectedRoute permissions={["OPD_VIEW"]}>
      <OpdPageContent />
    </ProtectedRoute>
  );
}
