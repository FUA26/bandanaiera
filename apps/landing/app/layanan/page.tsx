import { LayananPageClient } from "./layanan-page-client";
import { getServiceCategories, getAllServices } from "@/lib/services-data";

export default async function LayananPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string }>;
}) {
  const { kategori } = await searchParams;

  // Fetch data from directories
  const categories = await getServiceCategories();
  const allServices = await getAllServices();

  // Validate category slug - only use if valid
  const initialCategory = categories.find(c => c.slug === kategori)?.slug || null;

  return (
    <LayananPageClient
      categories={categories}
      services={allServices}
      initialCategory={initialCategory}
    />
  );
}
