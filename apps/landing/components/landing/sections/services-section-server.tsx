import { ServicesSectionClient } from './services-section-client';
import { getServicesGroupedByCategory } from '@/lib/services-data';

function toProxyPath(url?: string | null): string | null {
  if (!url) return null;
  if (url.startsWith('/api/public/')) return url.replace('/api/public/', '/api/proxy/public/');
  return url;
}

export async function ServicesSection() {
  const serviceCategories = await getServicesGroupedByCategory();

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
      images: service.images?.map((img) => ({
        cdnUrl: toProxyPath(img.cdnUrl),
        serveUrl: toProxyPath(img.serveUrl),
      })) ?? undefined,
    })),
  }));

  return <ServicesSectionClient serviceCategories={mappedCategories} />;
}
