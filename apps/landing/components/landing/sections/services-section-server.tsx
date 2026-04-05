import { ServicesSectionClient } from './services-section-client';
import { getServicesGroupedByCategory } from '@/lib/services-data';

/**
 * Server Component wrapper for ServicesSection
 * Fetches service data from directories and passes to client component
 */
export async function ServicesSection() {
  // Fetch services data from directories
  const serviceCategories = await getServicesGroupedByCategory();

  // Map categories and services to convert null to undefined for optional fields
  const mappedCategories = serviceCategories.map((category) => ({
    id: category.id,
    name: category.name,
    icon: category.icon,
    color: category.color,
    bgColor: category.bgColor,
    slug: category.slug,
    services: category.services.map((service) => ({
      slug: service.slug,
      icon: service.icon,
      name: service.name,
      description: service.description,
      categoryId: service.categoryId,
      badge: service.badge ?? undefined,
      stats: service.stats ?? undefined,
      images: service.images?.map(img => ({
        cdnUrl: img.cdnUrl,
        serveUrl: img.serveUrl,
      })) ?? undefined,
    })),
  }));

  return <ServicesSectionClient serviceCategories={mappedCategories} />;
}
