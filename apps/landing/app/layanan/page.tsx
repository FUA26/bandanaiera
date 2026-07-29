import { LayananPageClient } from "./layanan-page-client";
import { getServiceCategories, getAllServices } from "@/lib/services-data";

export const dynamic = 'force-dynamic';

export default async function LayananPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string; category?: string }>;
}) {
  const { kategori, category } = await searchParams;
  const activeCategory = kategori || category;

  // Fetch data from directories
  const categories = await getServiceCategories();
  const allServices = await getAllServices();

  // Map services to convert null to undefined for optional fields
  const services = allServices.map((service) => ({
    ...service,
    badge: service.badge ?? undefined,
    stats: service.stats ?? undefined,
  }));

  // Validate category slug - only use if valid
  const initialCategory = categories.find(c => c.slug === activeCategory)?.slug || null;

  return (
    <LayananPageClient
      categories={categories}
      services={services}
      initialCategory={initialCategory}
    />
  );
}
