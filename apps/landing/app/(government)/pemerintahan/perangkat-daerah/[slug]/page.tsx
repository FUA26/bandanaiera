import { Suspense } from 'react';
import { AgencyDetailClient } from './agency-detail-client';

export const metadata = {
  title: 'Agency Detail',
  description: 'Government agency information',
};

export default function AgencyDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AgencyDetailClient slug={params.slug} />
    </Suspense>
  );
}
