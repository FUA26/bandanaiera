import { ServicesSectionClient } from './services-section-client';
import { getServicesGroupedByCategory } from '@/lib/services-data';

/**
 * Server Component wrapper for ServicesSection
 * Fetches service data from directories and passes to client component
 */
export async function ServicesSection() {
  // Fetch services data from directories
  const serviceCategories = await getServicesGroupedByCategory();

  return <ServicesSectionClient serviceCategories={serviceCategories} />;
}
